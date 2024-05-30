import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import StringTensorType

# Stop words listesi
stop_words = [
    've', 'bu', 'bir', 'da', 'de', 'ile', 'mi', 'ama', 'daha', 'çok', 'en', 'olarak',
    'için', 'o', 'ne', 'mı', 'mu', 'on', 'ben', 'sen', 'biz', 'siz', 'onlar', 'var', 'yok', 'gibi'
]

# Verileri yükle
data = pd.read_csv("data.txt", delimiter="|", header=None, names=["etiket", "icerik"])
data["etiket"] = data["etiket"].str.strip()
data["icerik"] = data["icerik"].str.strip()

# Vektörleştirme ve model parametreleri
tfidf_vectorizer = TfidfVectorizer(stop_words=stop_words, ngram_range=(1, 2))
smote = SMOTE(random_state=42)

# Her sınıfta en az iki örneğin olup olmadığını kontrol edin
class_counts = data["etiket"].value_counts()
single_instance_classes = class_counts[class_counts < 2].index.tolist()

# Pipeline oluşturma
#model_pipeline = Pipeline([
 #   ('tfidf', tfidf_vectorizer),
 #   ('smote', smote),
  #  ('clf', LogisticRegression(max_iter=1000, multi_class='ovr'))
#])

# Pipeline'dan SMOTE çıkarılarak model oluşturulur
model_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words=stop_words, ngram_range=(1, 2))),
    ('clf', LogisticRegression(max_iter=1000, multi_class='ovr'))
])

# Veriyi eğitim ve test setlerine bölelim
X_train, X_test, y_train, y_test = train_test_split(data["icerik"], data["etiket"], test_size=0.2, random_state=42, stratify=data["etiket"])

# Hiperparametre ayarlama
param_grid = {'clf__C': [0.1, 1, 10]}
grid_search = GridSearchCV(model_pipeline, param_grid, cv=StratifiedKFold(5))
grid_search.fit(X_train, y_train)

# Model değerlendirmesi
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)
print("Sınıflandırma Raporu:")
print(classification_report(y_test, y_pred))
print("Karışıklık Matrisi:")
print(confusion_matrix(y_test, y_pred))

# Doğruluk skorunu hesaplama
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Doğruluk Skoru: {accuracy:.2f}")

# Modeli diske kaydetme
joblib.dump(best_model, "best_model.pkl")

# Modeli yükleme ve yeni veri üzerinde tahmin yapma
loaded_model = joblib.load("best_model.pkl")

# Kullanıcıdan sürekli input alma ve tahmin yapma
while True:
    new_data = input("Lütfen tahmin etmek için bir metin girin ya da çıkmak için 'çıkış' yazınız: ")
    if new_data.lower() == 'çıkış':
        print("Programdan çıkılıyor...")
        break
    prediction_proba = loaded_model.predict_proba([new_data])

    # Sınıf adlarını ve olasılıklarını eşleştirme
    class_probabilities = {cls: prob for cls, prob in zip(loaded_model.classes_, prediction_proba[0])}
    
    # En yüksek olasılık değerini ve karşılık gelen sınıfı bulma
    max_class = max(class_probabilities, key=class_probabilities.get)
    max_proba = class_probabilities[max_class]

    if max_proba >= 0.65:
        print("Tahmin:", max_class)
        print("Tahmin Olasılıkları:")
        for cls, prob in class_probabilities.items():
            print(f"{cls}: {prob:.4f}")
    else:
        print("Girilen parametrelere uygun kitap bulunamadı.")

# Modeli ONNX formatına dönüştür
initial_type = [('string_input', StringTensorType([None, 1]))]
onnx_model = convert_sklearn(best_model, initial_types=initial_type)

# ONNX modelini kaydet
with open("model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())