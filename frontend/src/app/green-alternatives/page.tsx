import { ExternalLink, Leaf } from "lucide-react";

const BRANDS = [
  {
    name: "Patagonia",
    logo: "🏔️",
    description: "Outdoor clothing brand committed to environmental activism, using recycled materials and Fair Trade certified production.",
    website: "https://www.patagonia.com",
    tags: ["Recycled Materials", "Fair Trade", "Repair Program"],
  },
  {
    name: "Eileen Fisher",
    logo: "🌿",
    description: "Timeless, sustainable women's fashion using organic fibers and a take-back program to recycle old garments.",
    website: "https://www.eileenfisher.com",
    tags: ["Organic Cotton", "Take-Back Program", "B Corp"],
  },
  {
    name: "Reformation",
    logo: "♻️",
    description: "Trendy, sustainable fashion brand with full supply chain transparency and carbon-neutral shipping.",
    website: "https://www.thereformation.com",
    tags: ["Carbon Neutral", "Sustainable Fabrics", "Transparent"],
  },
  {
    name: "Tentree",
    logo: "🌲",
    description: "Plants ten trees for every item purchased. Uses sustainable materials like organic cotton, cork, and TENCEL.",
    website: "https://www.tentree.com",
    tags: ["Tree Planting", "TENCEL", "B Corp"],
  },
  {
    name: "Thought Clothing",
    logo: "💭",
    description: "Ethical and sustainable brand using natural and recycled fabrics with minimal environmental impact.",
    website: "https://www.thoughtclothing.com",
    tags: ["Natural Fabrics", "Ethical Production", "Carbon Offset"],
  },
  {
    name: "Nudie Jeans",
    logo: "👖",
    description: "Swedish denim brand offering free repairs for life and using 100% organic cotton in all products.",
    website: "https://www.nudiejeans.com",
    tags: ["Organic Cotton", "Free Repairs", "Recycling"],
  },
  {
    name: "People Tree",
    logo: "🤝",
    description: "Pioneer of Fair Trade and sustainable fashion, partnering with artisan groups in developing countries.",
    website: "https://www.peopletree.co.uk",
    tags: ["Fair Trade", "Handmade", "Organic"],
  },
  {
    name: "Veja",
    logo: "👟",
    description: "French sneaker brand using organic cotton, wild rubber, and recycled plastic bottles in their footwear.",
    website: "https://www.veja-store.com",
    tags: ["Organic Cotton", "Wild Rubber", "Transparency"],
  },
  {
    name: "prAna",
    logo: "🧘",
    description: "Sustainable activewear brand using Fair Trade certified and bluesign approved materials for yoga and outdoor activities.",
    website: "https://www.prana.com",
    tags: ["Fair Trade", "Recycled Materials", "Activewear"],
  },
];

const TAG_COLORS = [
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
];

export default function GreenAlternativesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-800 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-4">
            <Leaf size={14} className="text-green-300" /> Sustainable Fashion Guide
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Green Alternatives</h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Discover brands leading the way in sustainable, ethical fashion so you can shop with confidence.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto text-center">
            {[
              { value: "92M", label: "tons of textile waste/year" },
              { value: "10%", label: "of global carbon emissions" },
              { value: "20%", label: "of water pollution from fashion" },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display font-bold text-2xl text-leaf">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANDS.map((brand, i) => (
            <div key={brand.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-3xl flex-shrink-0">
                  {brand.logo}
                </div>
                <h2 className="font-display font-bold text-gray-900 text-lg">{brand.name}</h2>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{brand.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {brand.tags.map((tag, j) => (
                  <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${TAG_COLORS[(i + j) % TAG_COLORS.length]}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-leaf text-leaf py-2.5 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors"
              >
                Visit Website <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
