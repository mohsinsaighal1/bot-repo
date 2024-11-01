import React, { useState, useEffect } from "react";
import "./App.css";
import Hamster from "./icons/Hamster";
import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";

useWeb3ModalAccount;
import {
  binanceLogo,
  dailyCipher,
  dailyCombo,
  dailyReward,
  dollarCoin,
  hamsterCoin,
  mainCharacter,
} from "./images";
import Info from "./icons/Info";
import Settings from "./icons/Settings";
import Mine from "./icons/Mine";
import Friends from "./icons/Friends";
import Coins from "./icons/Coins";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { UserType } from "./utils/types";
import { ethers } from "ethers";

const App: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();

  const [status, setStatus] = useState<string | null>(null);

  // 1. Get projectId
  const projectId = "212f5496ccafd88d903f69209067cf1d";
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    window.Telegram.WebApp.ready();

    const initData = window.Telegram.WebApp.initDataUnsafe;
    if (initData && initData.user) {
      setUser(initData.user);
    }
  }, []);

  // 2. Set chains
  const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  };

  // 3. Create a metadata object
  const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
  };

  // 4. Create Ethers config
  const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: "...", // used for the Coinbase SDK
    defaultChainId: 1, // used for the Coinbase SDK
  });

  // 5. Create a AppKit instance
  createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });

  const { close } = useWeb3Modal();
  const { address } = useWeb3ModalAccount();

  const levelNames = [
    "Bronze", // From 0 to 4999 coins
    "Silver", // From 5000 coins to 24,999 coins
    "Gold", // From 25,000 coins to 99,999 coins
    "Platinum", // From 100,000 coins to 999,999 coins
    "Diamond", // From 1,000,000 coins to 2,000,000 coins
    "Epic", // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master", // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord", // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0, // Bronze
    5000, // Silver
    25000, // Gold
    100000, // Platinum
    1000000, // Diamond
    2000000, // Epic
    10000000, // Legendary
    50000000, // Master
    100000000, // GrandMaster
    1000000000, // Lord
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(22749365);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const pointsToAdd = 11;
  const profitPerHour = 126420;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress =
      ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  const transferToken = async () => {
    try {
      // Check if MetaMask is installed
      if (!walletProvider) throw new Error("MetaMask is not installed");
      const wd: any = walletProvider;

      // Request account access
      await wd.request({ method: "eth_requestAccounts" });

      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const signer = provider.getSigner();

      // Token contract address on Polygon Mumbai
      const tokenAddress = "0x03360B84e4Ff4fC683AA13A70a2a7a8Afbd2351B"; // Replace with your token address
      const tokenAbi = [
        "function transfer(address to, uint amount) public returns (bool)",
      ];

      // Connect to the token contract
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      // Parse the amount with token decimals (adjust decimals if different from 18)
      const decimals = 18;
      const amount = "1";
      const recipient = "0x4713bb2ff73ef7b6c9b6c48adc5c8438793b7be2";
      const parsedAmount = ethers.utils.parseUnits(amount, decimals);

      // Execute the transfer
      const tx = await tokenContract.transfer(recipient, parsedAmount);
      setStatus(`Transaction sent! Tx hash: ${tx.hash}`);

      // Wait for transaction confirmation
      await tx.wait();
      setStatus("Transaction confirmed!");
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus("Transfer failed: " + error);
    }
  };

  // Function to transfer tokens using a private key
  const transferTokenWithPrivateKey = async () => {
    try {
      const privateKey =
        "0x1f9b79592b5fbff02f8bda1128615c96e7e1b41a463240da29ad313d1e65dc5b";
      const wallet = new ethers.Wallet(privateKey);

      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-amoy.g.alchemy.com/v2/_MuKmu4nB0X3LFMsqc2GFbF3qz79o8MP"
      );
      const signer = wallet.connect(provider);

      const tokenAddress = "0x03360B84e4Ff4fC683AA13A70a2a7a8Afbd2351B";
      const tokenAbi = [
        "function transfer(address to, uint amount) public returns (bool)",
      ];
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      const decimals = 18;
      const amount = "1";
      const parsedAmount = ethers.utils.parseUnits(amount, decimals);
      const recipient = "0xA56ABcBC74AC09D0dd94d072b5236E9AA1c6D456";

      // Manually set the gas fees
      const gasPrice = await provider.getGasPrice(); // Get current gas price
      const txOptions = {
        gasLimit: ethers.utils.hexlify(60000), // Increase gas limit
        maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
        maxFeePerGas: gasPrice.mul(2),
      };

      const tx = await tokenContract.transfer(
        recipient,
        parsedAmount,
        txOptions
      );
      console.log(tx.hash);
      setStatus(`Transaction sent! Tx hash: ${tx.hash}`);
      console.log(status);

      await tx.wait();
      console.log("tx confirmed", tx);
      setStatus("Transaction confirmed!");
      console.log(status);
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus("Transfer failed: " + error);
    }
  };

  const [prize, setPrize] = useState<number>(() => {
    const storedPrize = localStorage.getItem("prize");
    return storedPrize ? Number(storedPrize) : 0;
  });

  const generatePrize = () => {
    const newPrize = prize + 5;
    setPrize(newPrize);
    localStorage.setItem("prize", newPrize.toString());
  };

  useEffect(() => {
    const storedPrize = localStorage.getItem("prize");
    if (storedPrize) {
      setPrize(Number(storedPrize));
    }
  }, []);

  // Function to transfer tokens using a private key
  const transferPrizeTokens = async () => {
    try {
      const privateKey =
        "0x1f9b79592b5fbff02f8bda1128615c96e7e1b41a463240da29ad313d1e65dc5b";
      const wallet = new ethers.Wallet(privateKey);

      const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-amoy.g.alchemy.com/v2/_MuKmu4nB0X3LFMsqc2GFbF3qz79o8MP"
      );
      const signer = wallet.connect(provider);

      const tokenAddress = "0x03360B84e4Ff4fC683AA13A70a2a7a8Afbd2351B";
      const tokenAbi = [
        "function transfer(address to, uint amount) public returns (bool)",
      ];
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      const decimals = 18;
      const amount = `${prize}`;
      const parsedAmount = ethers.utils.parseUnits(amount, decimals);
      const recipient = "0x4d30898Cff2a1Ca00c792Fb4Ac0BDF442e607f3C";

      // Manually set the gas fees
      const gasPrice = await provider.getGasPrice(); // Get current gas price
      const txOptions = {
        gasLimit: ethers.utils.hexlify(60000), // Increase gas limit
        maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
        maxFeePerGas: gasPrice.mul(2),
      };

      const tx = await tokenContract.transfer(
        recipient,
        parsedAmount,
        txOptions
      );
      console.log(tx.hash);
      setStatus(`Transaction sent! Tx hash: ${tx.hash}`);
      console.log(status);

      await tx.wait();
      console.log("tx confirmed", tx);
      setStatus("Transaction confirmed!");
      console.log(status);
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatus("Transfer failed: " + error);
    }
  };

  return (
    <TonConnectUIProvider
      manifestUrl="https://bot-repo-euzt.vercel.app/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/argonteqbot/argonapp",
      }}
    >
      <div className="bg-black flex justify-center h-auto">
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
          <div className="px-4 z-10">
            <TonConnectButton />

            <button
              onClick={() => transferToken()}
              className="bg-white text-black p-3 rounded-lg mt-4 ms-5"
              disabled={!address}
            >
              Deposit
            </button>
            <button
              onClick={() => transferTokenWithPrivateKey()}
              className="bg-white text-black p-3 rounded-lg mt-4 ms-5"
              disabled={!address}
            >
              Withdraw
            </button>
            <div className="flex items-center space-x-2 pt-4">
              <div className="p-1 rounded-lg bg-[#1d2025]">
                <Hamster size={24} className="text-[#d4d4d4]" />
              </div>
              <div>
                <p className="text-sm">{user?.first_name}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div>
                <button
                  onClick={generatePrize}
                  className="bg-white text-black p-3 rounded-lg mt-4"
                >
                  Win prize
                </button>
                <p className="mb-10">Current Prize: {prize}</p>
              </div>
              <button
                onClick={transferPrizeTokens}
                className="bg-white text-black p-3 rounded-lg mt-4 h-fit"
              >
                Withdraw Prize
              </button>
            </div>

            <div className="flex items-center justify-between space-x-4 mt-1">
              <div className="flex items-center w-1/3">
                <div className="w-full">
                  <div className="flex justify-between">
                    <p className="text-sm">{levelNames[levelIndex]}</p>
                    <p className="text-sm">
                      {levelIndex + 1}{" "}
                      <span className="text-[#95908a]">
                        / {levelNames.length}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                    <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                      <div
                        className="progress-gradient h-2 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
                <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
                <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#85827d] font-medium">
                    Profit per hour
                  </p>
                  <div className="flex items-center justify-center space-x-1">
                    <img
                      src={dollarCoin}
                      alt="Dollar Coin"
                      className="w-[18px] h-[18px]"
                    />
                    <p className="text-sm">
                      {formatProfitPerHour(profitPerHour)}
                    </p>
                    <Info size={20} className="text-[#43433b]" />
                  </div>
                </div>
                <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                <Settings className="text-white" />
              </div>
            </div>
          </div>

          <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
            <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
              <div className="px-4 mt-6 flex justify-between gap-2">
                <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot"></div>
                  <img
                    src={dailyReward}
                    alt="Daily Reward"
                    className="mx-auto w-12 h-12"
                  />
                  <p className="text-[10px] text-center text-white mt-1">
                    Daily reward
                  </p>
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                    {dailyRewardTimeLeft}
                  </p>
                </div>
                <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot"></div>
                  <img
                    src={dailyCipher}
                    alt="Daily Cipher"
                    className="mx-auto w-12 h-12"
                  />
                  <p className="text-[10px] text-center text-white mt-1">
                    Daily cipher
                  </p>
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                    {dailyCipherTimeLeft}
                  </p>
                </div>
                <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                  <div className="dot"></div>
                  <img
                    src={dailyCombo}
                    alt="Daily Combo"
                    className="mx-auto w-12 h-12"
                  />
                  <p className="text-[10px] text-center text-white mt-1">
                    Daily combo
                  </p>
                  <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                    {dailyComboTimeLeft}
                  </p>
                </div>
              </div>

              <div className="px-4 mt-4 flex justify-center">
                <div className="px-4 py-2 flex items-center space-x-2">
                  <img
                    src={dollarCoin}
                    alt="Dollar Coin"
                    className="w-10 h-10"
                  />
                  <p className="text-4xl text-white">
                    {points.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="px-4 mt-4 flex justify-center">
                <div
                  className="w-80 h-80 p-4 rounded-full circle-outer"
                  onClick={handleCardClick}
                >
                  <div className="w-full h-full rounded-full circle-inner">
                    <img
                      src={mainCharacter}
                      alt="Main Character"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fixed div */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
          <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
            <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Exchange</p>
          </div>
          <div className="text-center text-[#85827d] w-1/5">
            <Mine className="w-8 h-8 mx-auto" />
            <p className="mt-1">Mine</p>
          </div>
          <div className="text-center text-[#85827d] w-1/5">
            <Friends className="w-8 h-8 mx-auto" />
            <p className="mt-1">Friends</p>
          </div>
          <div className="text-center text-[#85827d] w-1/5">
            <Coins className="w-8 h-8 mx-auto" />
            <p className="mt-1">Earn</p>
          </div>
          <div className="text-center text-[#85827d] w-1/5">
            <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Airdrop</p>
          </div>
        </div>

        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
            style={{
              top: `${click.y - 42}px`,
              left: `${click.x - 28}px`,
              animation: `float 1s ease-out`,
            }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            {pointsToAdd}
          </div>
        ))}
      </div>
    </TonConnectUIProvider>
  );
};

export default App;
