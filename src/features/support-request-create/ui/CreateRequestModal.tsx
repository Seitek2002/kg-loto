"use client";

import { useState } from "react";

import { clsx } from "clsx";
import { ChevronDown, Loader2, Paperclip } from "lucide-react";

import { useCreateSupportRequest } from "@/entities/support-request/api/supportApi";

import { Modal } from "@/shared/ui/Modal";

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRequestModal = ({
  isOpen,
  onClose,
}: CreateRequestModalProps) => {
  const { mutate: createRequest, isPending } = useCreateSupportRequest();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const isFormValid = subject !== "" && message.trim().length >= 10;

  const handleSubmit = () => {
    if (!isFormValid) return;
    const formData = new FormData();

    const selectElement = document.querySelector(
      "#subject-select",
    ) as HTMLSelectElement;
    const subjectText =
      selectElement?.options[selectElement.selectedIndex]?.text || subject;

    formData.append("subject", subjectText);
    formData.append("description", message);
    formData.append("ticket_type", "question");
    formData.append("channel", "website_chat");
    if (file) formData.append("file", file);

    createRequest(formData, {
      onSuccess: () => {
        setSubject("");
        setMessage("");
        setFile(null);
        onClose();
      },
      onError: (err) => console.error("Ошибка создания", err),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  return (
    // 🔥 Используем наш универсальный модал из shared
    <Modal isOpen={isOpen} onClose={onClose} className="p-6 lg:p-8">
      <h2 className="text-[20px] lg:text-[24px] font-black text-[#4B4B4B] uppercase mb-6 lg:mb-8 text-center lg:text-left">
        Новое обращение
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-[13px] lg:text-[14px] font-bold text-[#4B4B4B]">
          Тема сообщения
        </label>
        <div className="relative">
          <select
            id="subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={clsx(
              "w-full appearance-none bg-[#F5F5F7] rounded-xl px-4 py-3.5 text-[14px] outline-none border transition-colors cursor-pointer",
              subject === ""
                ? "text-gray-400 border-transparent"
                : "text-[#4B4B4B] border-transparent focus:border-[#FFD600]",
            )}
          >
            <option value="" disabled>
              Выберите тему
            </option>
            <option value="tech">Техническая ошибка</option>
            <option value="finance">Вопросы по оплате/выводу</option>
            <option value="game">Вопросы по правилам игры</option>
            <option value="other">Другое</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <label className="text-[13px] lg:text-[14px] font-bold text-[#4B4B4B]">
          Текст сообщения
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Опишите вашу проблему максимально подробно..."
          className="w-full bg-[#F5F5F7] rounded-xl px-4 py-3.5 text-[14px] text-[#4B4B4B] outline-none border border-transparent focus:border-[#FFD600] transition-colors resize-none placeholder:text-gray-400"
        />
      </div>

      <div className="mb-8">
        <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#E5E5E5] bg-white text-[#4B4B4B] cursor-pointer hover:bg-gray-50 transition-colors">
          <Paperclip size={18} />
          <span className="text-[13px] lg:text-[14px] font-medium">
            {file ? file.name : "Прикрепить файл"}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isPending}
        className={clsx(
          "w-full py-4 flex items-center justify-center gap-2 rounded-full font-black text-[13px] uppercase tracking-wider transition-all duration-300",
          isFormValid && !isPending
            ? "bg-[#FFD600] text-[#4B4B4B] hover:bg-[#F5C200] active:scale-95 shadow-md"
            : "bg-gray-200 text-gray-400 cursor-not-allowed",
        )}
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Создать"}
      </button>
    </Modal>
  );
};
