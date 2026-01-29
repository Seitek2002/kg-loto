export const LotteryConditions = () => {
  return (
    <section className='mb-12'>
      <h2 className='text-sm font-black font-benzin uppercase text-[#2D2D2D] mb-4'>
        УСЛОВИЯ УЧАСТИЯ:
      </h2>
      <p className='text-xs text-gray-500 font-rubik mb-4 leading-relaxed'>
        Приобретая лотерейный билет, участник подтверждает согласие на
        предоставление своих контактных данных и принимает условия получения
        информационно-рекламных сообщений от Организатора.
      </p>
      <ul className='flex flex-col gap-3 pl-4'>
        <li className='text-xs text-[#2D2D2D] font-bold font-rubik list-decimal marker:font-black'>
          Лицам младше 18-ти лет запрещено приобретать лотерейные билеты.
        </li>
        <li className='text-xs text-[#2D2D2D] font-bold font-rubik list-decimal marker:font-black'>
          Участником считается физическое лицо, законно приобретшее лотерейный
          билет.
        </li>
        <li className='text-xs text-[#2D2D2D] font-bold font-rubik list-decimal marker:font-black'>
          Стоимость билета не должна превышать цену, указанную на билете.
        </li>
        <li className='text-xs text-[#2D2D2D] font-bold font-rubik list-decimal marker:font-black'>
          Организатор удерживает у каждого участника, выигравшего приз,
          превышающий 5000 сом, налог 10%.
        </li>
        <li className='text-xs text-[#2D2D2D] font-bold font-rubik list-decimal marker:font-black'>
          Поддельные билеты аннулируются и изымаются. При спорах билет
          направляется в правоохранительные органы КР.
        </li>
        <li className='text-xs text-[#2D2D2D] font-bold font-rubik list-decimal marker:font-black'>
          Организатор несет ответственность за соблюдение условий и выдачу
          призов.
        </li>
      </ul>
    </section>
  );
};
