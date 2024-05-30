import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense

# Verileri yükleme ve işleme
def load_data(summary_file, class_file):
    with open(summary_file, 'r', encoding='utf-8') as file:
        summaries = file.readlines()
    with open(class_file, 'r', encoding='utf-8') as file:
        classes = file.readlines()
    return summaries, classes

# Verileri eğitim için hazırlama
def prepare_data(summaries, classes):
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(summaries)
    X_sequences = tokenizer.texts_to_sequences(summaries)
    X_padded = pad_sequences(X_sequences)
    class_labels = {book.strip(): idx for idx, book in enumerate(classes)}
    y_labels = [class_labels[book.strip()] for book in classes]
    return X_padded, np.array(y_labels), tokenizer, class_labels

# Modeli oluşturma
def create_model(vocab_size, max_length, num_classes):
    embedding_dim = 100
    model = Sequential([
        Embedding(vocab_size, embedding_dim, input_length=max_length),
        LSTM(128),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

# Veri yolu
summary_file = 'sucveceza.txt'
class_file = 'class.txt'

# Verileri yükleme
summaries, classes = load_data(summary_file, class_file)

# Verileri hazırlama
X_padded, y_labels, tokenizer, class_labels = prepare_data(summaries, classes)

# Modeli oluşturma
vocab_size = len(tokenizer.word_index) + 1
max_length = X_padded.shape[1]
num_classes = len(class_labels)
model = create_model(vocab_size, max_length, num_classes)

# Modeli eğitme
model.fit(np.array(X_padded), np.array(y_labels), epochs=10, batch_size=64, validation_split=0.2)

# Modeli kullanma
def predict_book(summary_text):
    sequence = tokenizer.texts_to_sequences([summary_text])
    padded_sequence = pad_sequences(sequence, maxlen=max_length)
    prediction = model.predict(padded_sequence)
    predicted_class_index = np.argmax(prediction)
    for book, idx in class_labels.items():
        if idx == predicted_class_index:
            return book.strip()

# Örnek kullanım
input_summary = "Raskolnikov'un iç çatışmaları"
predicted_book = predict_book(input_summary)
print(f"Verilen metin, \"{input_summary}\", kitabına ait. ({predicted_book})")
