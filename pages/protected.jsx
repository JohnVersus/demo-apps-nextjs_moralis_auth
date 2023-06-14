import { getSession } from "next-auth/react";
import Moralis from "moralis";

function Protected({ message, nftList }) {
  return (
    <div>
      <h3>Protected content</h3>
      <p>{message}</p>
      <pre>{JSON.stringify(nftList, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  const nftList = await Moralis.EvmApi.nft.getWalletNFTs({
    address: session.user.address,
    tokenAddresses: ["0xaA68a38715dDb7263b1Bf516F2eAFefD1273398c"],
  });

  return {
    props: {
      message:
        // if user has at least one NFT he will get protected content
        nftList.raw.total > 0
          ? "Nice! You have our NFT"
          : "Sorry, you don't have our NFT",
      nftList: nftList.raw.result,
    },
  };
}
export default Protected;
