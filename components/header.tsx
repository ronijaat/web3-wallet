import { ModeToggle } from './dark-btn';

const Header = () => {
  return (
    <div className="flex justify-around items-center mt-4">
      <h1 className="text-2xl font-bold text-blue-400 font-serif">
        Web Wallet
      </h1>
      <ModeToggle />
    </div>
  );
};

export default Header;
