export type Member = {
  id: string;
  name: string;
  city: string;
  wallet: string;
  rep: number;
  badges: string[];
  avatar: string; // emoji or url
  isCityGuide?: boolean;
};

export type City = {
  name: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
};

export const cities: City[] = [
  { name: "London", country: "UK", flag: "🇬🇧", lat: 51.5074, lng: -0.1278 },
  { name: "Berlin", country: "DE", flag: "🇩🇪", lat: 52.52, lng: 13.405 },
  { name: "Paris", country: "FR", flag: "🇫🇷", lat: 48.8566, lng: 2.3522 },
  { name: "Amsterdam", country: "NL", flag: "🇳🇱", lat: 52.3676, lng: 4.9041 },
  { name: "Barcelona", country: "ES", flag: "🇪🇸", lat: 41.3851, lng: 2.1734 },
  { name: "Lisbon", country: "PT", flag: "🇵🇹", lat: 38.7223, lng: -9.1393 },
  { name: "Rome", country: "IT", flag: "🇮🇹", lat: 41.9028, lng: 12.4964 },
  { name: "Munich", country: "DE", flag: "🇩🇪", lat: 48.1351, lng: 11.582 },
];

const apeEmojis = ["🦧", "🐵", "🙈", "🙉", "🙊", "🦍"];
const a = (i: number) => apeEmojis[i % apeEmojis.length];

export const members: Member[] = [
  { id: "1", name: "ApeKing_Berlin", city: "Berlin", wallet: "0x3f8c...9a2c", rep: 340, badges: ["city-guide"], avatar: a(0), isCityGuide: true },
  { id: "2", name: "LisbonApe", city: "Lisbon", wallet: "0x7b2e...441f", rep: 280, badges: ["connector"], avatar: a(1) },
  { id: "3", name: "ParisApe88", city: "Paris", wallet: "0x91dd...88a0", rep: 255, badges: ["frequent-flyer"], avatar: a(2) },
  { id: "4", name: "AmsterdamDegen", city: "Amsterdam", wallet: "0x44a1...0c5b", rep: 410, badges: ["city-guide", "connector"], avatar: a(3), isCityGuide: true },
  { id: "5", name: "BarcelonaApe", city: "Barcelona", wallet: "0xa9f4...22e1", rep: 190, badges: [], avatar: a(4) },
  { id: "6", name: "RomeApe", city: "Rome", wallet: "0xcc70...19be", rep: 145, badges: [], avatar: a(5) },
  { id: "7", name: "MunichApe", city: "Munich", wallet: "0x55b8...77f2", rep: 320, badges: ["city-guide"], avatar: a(0), isCityGuide: true },
  { id: "8", name: "LondonApe", city: "London", wallet: "0x12ee...90ab", rep: 490, badges: ["top-host", "connector"], avatar: a(1) },
  { id: "9", name: "BerlinNomad", city: "Berlin", wallet: "0x66cd...aa11", rep: 120, badges: [], avatar: a(2) },
  { id: "10", name: "ParisCollector", city: "Paris", wallet: "0xdead...beef", rep: 95, badges: [], avatar: a(3) },
  { id: "11", name: "LondonGallery", city: "London", wallet: "0xfa11...3300", rep: 210, badges: [], avatar: a(4) },
  { id: "12", name: "AmsterCanal", city: "Amsterdam", wallet: "0x0a0b...c0de", rep: 170, badges: [], avatar: a(5) },
  { id: "13", name: "BarcaSurf", city: "Barcelona", wallet: "0x7777...8888", rep: 80, badges: [], avatar: a(0) },
  { id: "14", name: "LisboaSol", city: "Lisbon", wallet: "0xb1ce...feed", rep: 60, badges: [], avatar: a(1) },
];

export type Post = {
  id: string;
  memberId: string;
  type: "REQUEST" | "OFFER";
  city: string;
  message: string;
  postedAt: string;
};

const now = Date.now();
const ago = (h: number) => new Date(now - h * 3600_000).toISOString();

export const posts: Post[] = [
  { id: "p1", memberId: "1", type: "REQUEST", city: "Berlin", message: "Looking for a great contemporary art gallery in Berlin this weekend.", postedAt: ago(1) },
  { id: "p2", memberId: "2", type: "OFFER", city: "Lisbon", message: "Happy to show visiting Apes around Lisbon — DM me.", postedAt: ago(3) },
  { id: "p3", memberId: "3", type: "REQUEST", city: "Paris", message: "Need a recommendation for a private dining room in Paris for 10.", postedAt: ago(5) },
  { id: "p4", memberId: "4", type: "OFFER", city: "Amsterdam", message: "Hosting a small Apes meetup in Amsterdam next Friday — all welcome.", postedAt: ago(8) },
  { id: "p5", memberId: "8", type: "OFFER", city: "London", message: "Two extra seats at a Mayfair tasting on Thursday. First Apes to reply.", postedAt: ago(12) },
  { id: "p6", memberId: "7", type: "REQUEST", city: "Munich", message: "Any Apes around for Oktoberfest planning? Looking for tent intel.", postedAt: ago(20) },
  { id: "p7", memberId: "5", type: "REQUEST", city: "Barcelona", message: "Best tailor in Barcelona for a last-minute suit?", postedAt: ago(26) },
  { id: "p8", memberId: "6", type: "OFFER", city: "Rome", message: "Vespa tour of Rome this Sunday — bringing one extra helmet.", postedAt: ago(30) },
  { id: "p9", memberId: "11", type: "OFFER", city: "London", message: "Studio visit at a friend's gallery in Shoreditch next week.", postedAt: ago(40) },
  { id: "p10", memberId: "10", type: "REQUEST", city: "Paris", message: "Looking to swap a Mutant for a Bored Ape — coffee in Le Marais?", postedAt: ago(50) },
];

export const me: Member = members[0];

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
