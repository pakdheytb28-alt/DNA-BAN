
import { GoogleGenAI } from "@google/genai";
import { TireItem, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getInventoryInsights = async (tires: TireItem[], transactions: Transaction[]) => {
  try {
    const inventoryData = tires.map(t => ({
      name: `${t.brand} ${t.model} (${t.size})`,
      stock: t.stock,
      min: t.minStock
    }));

    const transactionSummary = transactions.slice(0, 20).map(tx => ({
      item: tires.find(t => t.id === tx.itemId)?.model,
      type: tx.type,
      qty: tx.quantity,
      date: tx.date
    }));

    const prompt = `Analisis stok toko ban motor berikut:
    Stok Sekarang: ${JSON.stringify(inventoryData)}
    20 Transaksi Terakhir: ${JSON.stringify(transactionSummary)}
    
    Tugas Anda:
    1. Berikan ringkasan kondisi stok (aman/kritis).
    2. Berikan saran item mana yang harus segera dipesan berdasarkan transaksi terakhir dan level stok.
    3. Prediksi tren permintaan singkat.
    4. Berikan tips pengelolaan stok ban yang efisien.
    
    Berikan respon dalam Bahasa Indonesia yang santai tapi profesional, format dalam markdown singkat.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Maaf, sistem AI sedang sibuk. Silakan coba beberapa saat lagi untuk mendapatkan analisis stok.";
  }
};
