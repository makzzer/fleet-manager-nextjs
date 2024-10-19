import React, { useState } from 'react';
import axios from 'axios';

const SendTelegramMessage = () => {
  const [message, setMessage] = useState('');
  const telegramBotToken = '7948811886:AAF4pJZPFcFEcPLw7TxJ6G-f75xusJjqXO4'; // Coloca aquí tu token del bot de Telegram
  const chatId = 'TU_CHAT_ID'; // Coloca aquí tu chat ID de Telegram

  const botTelegram = async () => {
    try {
      await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
      });
      alert('Mensaje enviado a Telegram');
    } catch (error) {
      console.error('Error al enviar mensaje a Telegram:', error);
      alert('Error al enviar el mensaje');
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Enviar mensaje a Telegram</h2>
      <textarea
        className="w-full p-2 rounded bg-gray-700 mb-4"
        placeholder="Escribe tu mensaje..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={botTelegram}
      >
        Enviar Mensaje
      </button>
    </div>
  );
};

export default botTelegram;
