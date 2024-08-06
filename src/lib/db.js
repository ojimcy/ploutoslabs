const WALLETS_KEY = 'WALLETS_KEY';

export const getWalletsFromDb = () => {
  let walletStr = localStorage.getItem(WALLETS_KEY)
  if (!walletStr) walletStr = '[]'
  return JSON.parse(walletStr)
}

export const addWallet = async (wallet) => {
  const wallets = getWalletsFromDb()
  wallets.push(wallet)
  localStorage.setItem(WALLETS_KEY, JSON.stringify(wallets))
}
