'use client';

import Image from 'next/image';

// 🔥 DRY: Мини-компонент для инпутов
const InputField = ({
  label,
  type = 'text',
  defaultValue,
  placeholder,
}: any) => (
  <div className='flex flex-col gap-1.5'>
    <label className='text-[13px] font-semibold text-[#4B4B4B] pl-1'>
      {label}
    </label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className='w-full border border-[#E5E5E5] rounded-[16px] px-5 py-4 text-[14px] text-[#2D2D2D] outline-none focus:border-[#FF7600] transition-colors placeholder:text-gray-400'
    />
  </div>
);

export const AccountForm = () => {
  return (
    <div className='flex flex-col gap-8'>
      {/* Аватар */}
      <div className='flex items-center gap-4'>
        <div className='relative w-[60px] h-[60px] rounded-full overflow-hidden border border-gray-200'>
          <Image
            src='/avatar-placeholder.png'
            alt='Avatar'
            fill
            className='object-cover'
          />
        </div>
        <div className='flex items-center gap-2'>
          <button className='bg-[#4B4B4B] text-white text-[11px] font-bold uppercase rounded-full px-5 py-2.5 active:scale-95 transition-transform'>
            Сменить фото
          </button>
          <button className='bg-white border border-[#E5E5E5] text-[#4B4B4B] text-[11px] font-bold uppercase rounded-full px-5 py-2.5 hover:bg-gray-50 active:scale-95 transition-all'>
            Удалить
          </button>
        </div>
      </div>

      {/* Основные данные */}
      <div className='flex flex-col gap-5'>
        <InputField label='Фамилия' defaultValue='Дастан' />
        <InputField label='Имя' defaultValue='Дастанов' />
        <InputField label='Отчество' defaultValue='Дастанович' />
        <InputField label='Дата рождения' defaultValue='09.09.2009' />
        <InputField label='ИНН' defaultValue='10909200943586' />
      </div>

      {/* Паспортные данные (Заглушки для фото) */}
      <div className='flex flex-col gap-2'>
        <label className='text-[13px] font-semibold text-[#4B4B4B] pl-1'>
          Паспортные данные
        </label>
        <div className='border border-dashed border-[#E5E5E5] rounded-[24px] p-4 flex flex-col gap-4'>
          <div className='relative w-full h-[180px] bg-gray-50 rounded-[16px] overflow-hidden'>
            {/* Замени на реальную картинку паспорта или логику загрузки */}
            <Image
              src='/passport-front.png'
              alt='Passport Front'
              fill
              className='object-contain p-2'
            />
          </div>
          <div className='relative w-full h-[180px] bg-gray-50 rounded-[16px] overflow-hidden'>
            <Image
              src='/passport-back.png'
              alt='Passport Back'
              fill
              className='object-contain p-2'
            />
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className='flex flex-col gap-5'>
        <InputField
          label='Электронная почта'
          defaultValue='seitek.seitekov@gmail.com'
        />
        <InputField label='Номер телефона' defaultValue='+996 555 555 555' />
      </div>

      {/* Опасная зона */}
      <div className='flex flex-col items-center gap-4 mt-4'>
        <button className='text-[#EB5757] text-[13px] font-bold hover:underline transition-all'>
          Удалить аккаунт
        </button>
        <button className='text-[#4B4B4B] text-[13px] font-bold hover:underline transition-all'>
          Выйти
        </button>
      </div>
    </div>
  );
};
