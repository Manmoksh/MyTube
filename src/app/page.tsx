import Image from "next/image";

const Home = () => {
  return (
    <div>
      <Image src="/logo.svg" alt="logo" height={50} width={50} />
      <p className="text-xl tracking-tight font-semibold">NewTube</p>
    </div>
  );
};

export default Home;
