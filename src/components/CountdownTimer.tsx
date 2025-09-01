export default function CountdownTimer({ timeLeft }: { timeLeft: number }) {
  return <h2 className="text-main text-[2rem]">{timeLeft}</h2>;
}
