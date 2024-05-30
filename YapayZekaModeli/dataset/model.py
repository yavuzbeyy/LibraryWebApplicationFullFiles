import numpy as np
import pandas as pd
import string
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import EarlyStopping

# Stop words listesi (Türkçe için genişletilebilir)
stop_words = set([
    've', 'bu', 'bir', 'da', 'de', 'ile', 'mi', 'ama', 'daha', 'çok', 'en', 'olarak',
    'için', 'o', 'ne', 'mı', 'mu', 'on', 'ben', 'sen', 'biz', 'siz', 'onlar', 'var', 'yok', 'gibi'
])

# Dosyayı okuma
data = pd.read_csv("data.txt", delimiter="|", header=None, names=["label", "text"])

# Metin verilerinde ön işleme
def preprocess_text(text):
    text = text.lower()  # Küçük harfe çevir
    text = ''.join([char for char in text if char not in string.punctuation])  # Noktalama işaretlerini kaldır
    text = ' '.join([word for word in text.split() if word not in stop_words])  # Stop words'leri kaldır
    return text

data['text'] = data['text'].apply(preprocess_text)

# Tokenizer ve padding işlemleri
tokenizer = Tokenizer(num_words=30000)
tokenizer.fit_on_texts(data['text'])
sequences = tokenizer.texts_to_sequences(data['text'])
max_length = int(np.percentile([len(x) for x in sequences], 95))  # %95 persentil uzunluk
padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post')

# Etiketlerin sayılara ve one-hot encoding yapılması
unique_labels = sorted(set(data['label']))
label_to_index = {label: index for index, label in enumerate(unique_labels)}
encoded_labels = np.array([label_to_index[label] for label in data['label']])
categorical_labels = to_categorical(encoded_labels, num_classes=len(unique_labels))

# Model kurulumu
vocab_size = len(tokenizer.word_index) + 1
embedding_dim = 100
model = Sequential([
    Embedding(vocab_size, embedding_dim),
    Bidirectional(LSTM(128, dropout=0.2, recurrent_dropout=0.2)),
    Dense(len(unique_labels), activation='softmax')
])
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Modeli eğitme
X_train, X_val, y_train, y_val = train_test_split(padded_sequences, categorical_labels, test_size=0.2, random_state=22)
print(X_train)
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
history = model.fit(X_train, y_train, epochs=20, validation_data=(X_val, y_val), callbacks=[early_stopping])

# Tahmin fonksiyonu
def predict_book(summary_text):
    summary_text = preprocess_text(summary_text)  # Tahmin öncesi metni ön işle
    sequence = tokenizer.texts_to_sequences([summary_text])
    padded_sequence = pad_sequences(sequence, maxlen=max_length, padding='post')
    prediction_probabilities = model.predict(padded_sequence)[0]
    predicted_label_index = np.argmax(prediction_probabilities)
    confidence = prediction_probabilities[predicted_label_index]
    return unique_labels[predicted_label_index], confidence

# Sürekli input alma ve tahmin etme
while True:
    input_summary = input("Lütfen tahmin etmek için bir metin girin ya da çıkmak için 'çıkış' yazınız: ")
    if input_summary.lower() == 'çıkış':
        print("Programdan çıkılıyor...")
        break
    predicted_book, confidence = predict_book(input_summary)
    print(f"Verilen metin, \"{input_summary}\", kitabına ait: {predicted_book} ile %{confidence*100:.2f} güvenilirlik.")
