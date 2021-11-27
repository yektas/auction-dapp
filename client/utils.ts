export default function convertEpochToHumanReadableString(epochTime: number) {
  //const countDownDate = new Date(epochTime).getTime();
  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the count down date
  let distance = Math.floor(epochTime * 1000 - now);

  if (distance <= 0) {
    return "Ended";
  }

  // Time calculations for days, hours, minutes and seconds
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}

export function isAuctionEnded(expireTime: number): boolean {
  const now = new Date().getTime();

  // Find the distance between now and the count down date
  let distance = Math.floor(expireTime * 1000 - now);

  if (distance <= 0) {
    return true;
  }
  return false;
}

export function getEllipsisTxt(str: string, n = 6) {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
}
