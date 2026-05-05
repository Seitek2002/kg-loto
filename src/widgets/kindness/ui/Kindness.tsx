import Image from "next/image";

export const Kindness = () => {
  return (
    <section className="bg-white rounded-[24px] lg:rounded-[40px] py-8 lg:py-15 px-6 lg:px-22 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mt-12 lg:mt-25 shadow-sm">
      {/* Левая часть (Логотип + текст) */}
      <div className="flex flex-col items-center shrink-0">
        <Image
          src="/kindness-logo.png"
          width={400}
          height={400}
          alt="kindness"
          className="w-48 sm:w-64 lg:w-[400px] h-auto object-contain"
        />
        <span className="text-[#FF7600] text-sm sm:text-base lg:text-xl text-center mx-auto font-semibold max-w-[250px] lg:max-w-[320px] block mt-4">
          Мы направляем часть средств на социальные проекты
        </span>
      </div>

      {/* Правая часть (10% + Описание) */}
      <div className="flex flex-col text-center lg:text-left w-full lg:max-w-[60%]">
        <span className="text-[#FF7600] text-[70px] sm:text-[90px] lg:text-[110px] font-extrabold leading-none">
          10%
        </span>
        <span className="text-[#4B4B4B] block my-4 lg:my-6 font-bold font-benzin text-base sm:text-lg lg:text-3xl">
          от каждого билета идут на развитие спорта, культуры и социальные
          инициативы по всей стране.
        </span>
        <span className="text-[#FF7600] font-bold font-benzin text-lg sm:text-xl lg:text-3xl">
          Делаем добро вместе!
        </span>
      </div>
    </section>
  );
};
