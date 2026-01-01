import React, { useState, useEffect } from 'react';
import './SpeechPlayer.css';

interface Props {
    text: string;
}

const SpeechPlayer: React.FC<Props> = ({ text }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [rate, setRate] = useState<number>(1.0);
    const synth = window.speechSynthesis;

    const handleSpeech = (newRate?: number) => {
        if (isPlaying) {
            synth.cancel();
            setIsPlaying(false);
            if (newRate === undefined) return;
        }

        // Xử lý văn bản
        // Lọc bỏ thẻ HTML và chữ (NLĐO) đầu dòng để đọc
        const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\(NLĐO\)\s*-\s*/, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Lấy giọng đọc từ Windows
        // Settings --> Time & language --> Speech -->  Manage voices --> Add voices
        // Chọn vietnamese 
        const voices = synth.getVoices();
        const localVoice = voices.find(v => v.lang === 'vi-VN' || v.lang.includes('vi-VN'));

        if (localVoice) utterance.voice = localVoice;
        else utterance.lang = 'vi-VN';
        // ÁP DỤNG TỐC ĐỘ ĐỌC TỪ STATE
        utterance.rate = newRate !== undefined ? newRate : rate;
        utterance.onend = () => setIsPlaying(false);
        synth.speak(utterance);
        setIsPlaying(true);
    };
    //HÀM XỬ LÝ KHI CHỌN TỐC ĐỘ 
    const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRate = parseFloat(e.target.value);
        setRate(newRate);
        // Nếu đang đọc thì đọc lại ngay với tốc độ mới
        if (isPlaying) {
            synth.cancel();
            handleSpeech(newRate);
        }
    };

    useEffect(() => {
        const loadVoices = () => { window.speechSynthesis.getVoices(); };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        return () => window.speechSynthesis.cancel();
    }, []);

    return (
        <div className="sp-container">
            <div className="sp-left-section" onClick={() => handleSpeech()}>
                <button className="sp-play-btn">
                    {isPlaying ? '❚❚' : '▶'} 
                </button>
                <span className="sp-text-label">
                    {isPlaying ? 'Đang đọc bài' : 'Nghe đọc bài'}
                </span>
            </div>

            <div className="sp-right-section">
                <select 
                    value={rate} 
                    onChange={handleRateChange}
                    className="sp-select-box"
                >
                    <option value="0.8">0.8x</option>
                    <option value="1">1.0x</option>                   
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                </select>
            </div>
        </div>
    );
};

export default SpeechPlayer;