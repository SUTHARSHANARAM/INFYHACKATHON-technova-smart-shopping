import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TechNova database seeding...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // Create Users
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const customerPassword = await bcrypt.hash('Customer@123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'TechNova Admin',
      email: 'admin@technova.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'customer@technova.com',
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
    },
  });

  console.log(`👤 Created Demo Users: Admin (${admin.email}), Customer (${customer.email})`);

  // Create Categories (Parent + Subcategories)
  const categoriesData = [
    {
      name: 'Smartphones & Tablets',
      slug: 'smartphones-tablets',
      description: 'Latest premium smartphones, flagship tablets, and accessories',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      subs: [
        { name: 'Flagship Smartphones', slug: 'flagship-smartphones', description: 'Top tier smartphones with premium cameras and performance' },
        { name: 'Tablets & iPads', slug: 'tablets-ipads', description: 'High performance tablets for work and creativity' },
      ],
    },
    {
      name: 'Laptops & Computers',
      slug: 'laptops-computers',
      description: 'High performance ultrabooks, gaming laptops, and workstation PCs',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      subs: [
        { name: 'Ultrabooks', slug: 'ultrabooks', description: 'Thin and lightweight laptops for everyday productivity' },
        { name: 'Gaming Laptops', slug: 'gaming-laptops', description: 'High refresh rate laptops with powerful dedicated GPUs' },
        { name: 'Workstation PCs', slug: 'workstation-pcs', description: 'Heavy-duty desktop PCs for rendering and development' },
      ],
    },
    {
      name: 'Displays & Monitors',
      slug: 'displays-monitors',
      description: '4K UHD, OLED gaming monitors, and professional color-accurate displays',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
      subs: [
        { name: 'Gaming Monitors', slug: 'gaming-monitors', description: 'High Hz curved and flat panels with G-Sync' },
        { name: 'Professional Displays', slug: 'professional-displays', description: 'Color accurate 4K & 5K IPS monitors for creators' },
      ],
    },
    {
      name: 'Audio & Headphones',
      slug: 'audio-headphones',
      description: 'Active noise-canceling headphones, TWS earbuds, and studio monitors',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      subs: [
        { name: 'Wireless Earbuds', slug: 'wireless-earbuds', description: 'True wireless earbuds with ANC and spatial audio' },
        { name: 'Over-Ear Headphones', slug: 'over-ear-headphones', description: 'Premium noise canceling circumaural headphones' },
      ],
    },
    {
      name: 'Keyboards & Mice',
      slug: 'keyboards-mice',
      description: 'Mechanical keyboards, ergonomic mice, and productivity desktop combos',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
      subs: [
        { name: 'Mechanical Keyboards', slug: 'mechanical-keyboards', description: 'Customizable mechanical keyboards with hot-swap switches' },
        { name: 'Precision Mice', slug: 'precision-mice', description: 'High DPI ergonomic and ultra-light wireless mice' },
      ],
    },
    {
      name: 'Gaming Gear',
      slug: 'gaming-gear',
      description: 'Pro gaming headsets, controllers, RGB accessories, and streaming gear',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
      subs: [
        { name: 'Gaming Headsets', slug: 'gaming-headsets', description: '7.1 surround sound headsets with clear broadcast mics' },
        { name: 'Controllers & Gamepads', slug: 'controllers-gamepads', description: 'Console & PC gamepads with tactile feedback' },
      ],
    },
    {
      name: 'Storage Devices',
      slug: 'storage-devices',
      description: 'High-speed PCIe 4.0 NVMe SSDs, external portable drives, and NAS storage',
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600',
      subs: [
        { name: 'Internal NVMe SSDs', slug: 'internal-nvme-ssds', description: 'Blazing fast Gen4 and Gen5 M.2 solid state drives' },
        { name: 'External Drives', slug: 'external-drives', description: 'Rugged portable SSDs and high capacity external HDDs' },
      ],
    },
    {
      name: 'Computer Accessories',
      slug: 'computer-accessories',
      description: 'Thunderbolt docks, USB-C hubs, power banks, and laptop stands',
      image: 'https://images.unsplash.com/photo-1616440342231-50795c7324ec?w=600',
      subs: [
        { name: 'USB-C Docks & Hubs', slug: 'usbc-docks-hubs', description: 'Multi-port adapters and high speed docking stations' },
        { name: 'Power & Cables', slug: 'power-cables', description: 'GaN fast chargers, braided cables, and power banks' },
      ],
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      },
    });
    categoryMap[cat.slug] = parent.id;

    for (const sub of cat.subs) {
      const subCat = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          parentId: parent.id,
        },
      });
      categoryMap[sub.slug] = subCat.id;
    }
  }

  console.log(`📁 Created Categories & Subcategories (${Object.keys(categoryMap).length} total)`);

  // Helper to make slug
  const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  // Raw Products Data (52 Realistic Technology Products)
  const productsRaw = [
    // 1. Flagship Smartphones
    {
      name: 'Apple iPhone 16 Pro Max',
      brand: 'Apple',
      SKU: 'APL-IP16PM-256-NT',
      categorySlug: 'flagship-smartphones',
      description: 'Super Retina XDR display with ProMotion, A18 Pro chip, 48MP Fusion camera system, and Titanium design.',
      price: 144900,
      originalPrice: 154900,
      discount: 6.45,
      stock: 25,
      rating: 4.9,
      reviewCount: 128,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
      ],
      specifications: { Processor: 'A18 Pro', RAM: '8 GB', Storage: '256 GB', Display: '6.9" Super Retina XDR OLED', Battery: '4685 mAh', Camera: '48MP + 48MP + 12MP', OS: 'iOS 18' }
    },
    {
      name: 'Samsung Galaxy S24 Ultra 5G',
      brand: 'Samsung',
      SKU: 'SAM-S24U-512-TB',
      categorySlug: 'flagship-smartphones',
      description: 'Galaxy AI is here. Epic titanium armor frame, built-in S Pen, 200MP camera with Quad Tele System.',
      price: 129999,
      originalPrice: 139999,
      discount: 7.14,
      stock: 18,
      rating: 4.8,
      reviewCount: 94,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'
      ],
      specifications: { Processor: 'Snapdragon 8 Gen 3 for Galaxy', RAM: '12 GB', Storage: '512 GB', Display: '6.8" Dynamic AMOLED 2X 120Hz', Battery: '5000 mAh', Camera: '200MP + 50MP + 12MP + 10MP', OS: 'Android 14' }
    },
    {
      name: 'Google Pixel 9 Pro XL',
      brand: 'Google',
      SKU: 'GGL-PX9P-128-OBS',
      categorySlug: 'flagship-smartphones',
      description: 'Powered by Google Tensor G4 chip, Gemini AI built-in, pro camera system with 30x Super Res Zoom.',
      price: 109999,
      originalPrice: 124999,
      discount: 12.0,
      stock: 15,
      rating: 4.7,
      reviewCount: 56,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
      ],
      specifications: { Processor: 'Google Tensor G4', RAM: '16 GB', Storage: '128 GB', Display: '6.8" Super Actua OLED 120Hz', Battery: '5060 mAh', Camera: '50MP + 48MP + 48MP', OS: 'Android 15' }
    },
    {
      name: 'OnePlus 12 5G',
      brand: 'OnePlus',
      SKU: '1PL-12-256-GRN',
      categorySlug: 'flagship-smartphones',
      description: 'Smooth Beyond Belief. Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, 100W SUPERVOOC charging.',
      price: 64999,
      originalPrice: 69999,
      discount: 7.14,
      stock: 30,
      rating: 4.6,
      reviewCount: 112,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800'
      ],
      specifications: { Processor: 'Snapdragon 8 Gen 3', RAM: '12 GB', Storage: '256 GB', Display: '6.82" 2K 120Hz ProXDR', Battery: '5400 mAh', Camera: '50MP + 64MP + 48MP', OS: 'OxygenOS 14' }
    },

    // 2. Tablets & iPads
    {
      name: 'Apple iPad Pro 13" M4 OLED',
      brand: 'Apple',
      SKU: 'APL-IPP13-M4-256',
      categorySlug: 'tablets-ipads',
      description: 'Impossibly thin design, Ultra Retina XDR Tandem OLED display, groundbreaking M4 chip performance.',
      price: 129900,
      originalPrice: 139900,
      discount: 7.15,
      stock: 12,
      rating: 4.9,
      reviewCount: 42,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
      ],
      specifications: { Processor: 'Apple M4', RAM: '8 GB', Storage: '256 GB', Display: '13.0" Ultra Retina XDR Tandem OLED', Battery: '38.99 Wh', OS: 'iPadOS 18' }
    },
    {
      name: 'Samsung Galaxy Tab S9 Ultra',
      brand: 'Samsung',
      SKU: 'SAM-TS9U-256-GR',
      categorySlug: 'tablets-ipads',
      description: 'Dynamic AMOLED 2X screen, IP68 water & dust resistance, S Pen included in box, Snapdragon 8 Gen 2.',
      price: 108999,
      originalPrice: 121999,
      discount: 10.65,
      stock: 8,
      rating: 4.8,
      reviewCount: 38,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'
      ],
      specifications: { Processor: 'Snapdragon 8 Gen 2', RAM: '12 GB', Storage: '256 GB', Display: '14.6" Dynamic AMOLED 2X 120Hz', Battery: '11200 mAh', OS: 'Android 13' }
    },

    // 3. Ultrabooks
    {
      name: 'Apple MacBook Pro 16" M3 Max',
      brand: 'Apple',
      SKU: 'APL-MBP16-M3MX-36GB',
      categorySlug: 'ultrabooks',
      description: 'M3 Max with 16-core CPU and 40-core GPU. Liquid Retina XDR display, up to 22 hours battery life.',
      price: 349900,
      originalPrice: 379900,
      discount: 7.89,
      stock: 10,
      rating: 5.0,
      reviewCount: 88,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
      ],
      specifications: { Processor: 'Apple M3 Max (16-Core)', RAM: '36 GB Unified', Storage: '1 TB SSD', Display: '16.2" Liquid Retina XDR (3456x2234)', GPU: '40-Core GPU', Weight: '2.16 kg' }
    },
    {
      name: 'Dell XPS 14 9440 Intel Core Ultra 7',
      brand: 'Dell',
      SKU: 'DEL-XPS14-U7-16GB',
      categorySlug: 'ultrabooks',
      description: 'Iconic futuristic design with capacitive touch function row, 3.2K OLED Touch display, RTX 4050.',
      price: 199990,
      originalPrice: 219990,
      discount: 9.09,
      stock: 14,
      rating: 4.7,
      reviewCount: 29,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
      ],
      specifications: { Processor: 'Intel Core Ultra 7 155H', RAM: '16 GB LPDDR5X', Storage: '1 TB PCIe Gen4 SSD', Display: '14.5" 3.2K OLED Touch 120Hz', GPU: 'NVIDIA RTX 4050 6GB', Weight: '1.68 kg' }
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 12',
      brand: 'Lenovo',
      SKU: 'LNV-X1C12-U7-32GB',
      categorySlug: 'ultrabooks',
      description: 'The executive benchmark ultrabook. Carbon fiber chassis, Intel Evo edition, legendarily tactile keyboard.',
      price: 184990,
      originalPrice: 199990,
      discount: 7.5,
      stock: 20,
      rating: 4.8,
      reviewCount: 45,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
      ],
      specifications: { Processor: 'Intel Core Ultra 7 165H', RAM: '32 GB LPDDR5X', Storage: '1 TB NVMe SSD', Display: '14" 2.8K OLED 120Hz', GPU: 'Intel Arc Graphics', Weight: '1.09 kg' }
    },
    {
      name: 'Asus Zenbook 14 OLED UX3405',
      brand: 'Asus',
      SKU: 'ASU-ZB14-U5-16GB',
      categorySlug: 'ultrabooks',
      description: 'Ultra-portable 1.2kg Intel Evo laptop with breathtaking 3K 120Hz OLED HDR display.',
      price: 99990,
      originalPrice: 114990,
      discount: 13.04,
      stock: 22,
      rating: 4.6,
      reviewCount: 61,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
      ],
      specifications: { Processor: 'Intel Core Ultra 5 125H', RAM: '16 GB LPDDR5X', Storage: '1 TB Gen4 SSD', Display: '14.0" 3K (2880 x 1800) OLED', GPU: 'Intel Arc Graphics', Weight: '1.20 kg' }
    },

    // 4. Gaming Laptops
    {
      name: 'Asus ROG Strix SCAR 18 (2024)',
      brand: 'Asus',
      SKU: 'ASU-SCAR18-I9-RTX4090',
      categorySlug: 'gaming-laptops',
      description: 'Dominate the battlefield. Intel Core i9-14900HX, NVIDIA RTX 4090 16GB, 2.5K 240Hz ROG Nebula HDR display.',
      price: 389990,
      originalPrice: 419990,
      discount: 7.14,
      stock: 6,
      rating: 4.9,
      reviewCount: 35,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
      ],
      specifications: { Processor: 'Intel Core i9-14900HX', RAM: '32 GB DDR5 5600MHz', Storage: '2 TB PCIe 4.0 NVMe SSD', Display: '18" QHD+ 240Hz Mini LED', GPU: 'NVIDIA GeForce RTX 4090 16GB', Weight: '3.10 kg' }
    },
    {
      name: 'Lenovo Legion Pro 7i Gen 9',
      brand: 'Lenovo',
      SKU: 'LNV-LEGPRO7-I9-4080',
      categorySlug: 'gaming-laptops',
      description: 'AI-tuned gaming powerhouse with Legion Coldfront vapor chamber cooling and 240Hz display.',
      price: 269990,
      originalPrice: 289990,
      discount: 6.9,
      stock: 11,
      rating: 4.8,
      reviewCount: 52,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
      ],
      specifications: { Processor: 'Intel Core i9-14900HX', RAM: '32 GB DDR5', Storage: '1 TB Gen4 SSD', Display: '16" WQXGA 240Hz IPS', GPU: 'NVIDIA GeForce RTX 4080 12GB', Weight: '2.80 kg' }
    },
    {
      name: 'HP Omen 16 RTX 4070',
      brand: 'HP',
      SKU: 'HP-OMEN16-R7-4070',
      categorySlug: 'gaming-laptops',
      description: 'Ryzen 7 7840HS paired with RTX 4070 for fluid 1440p high frame rate gaming.',
      price: 139990,
      originalPrice: 154990,
      discount: 9.68,
      stock: 18,
      rating: 4.5,
      reviewCount: 44,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'
      ],
      specifications: { Processor: 'AMD Ryzen 7 7840HS', RAM: '16 GB DDR5', Storage: '1 TB Gen4 SSD', Display: '16.1" QHD 165Hz IPS', GPU: 'NVIDIA GeForce RTX 4070 8GB', Weight: '2.37 kg' }
    },

    // 5. Workstation PCs
    {
      name: 'Apple Mac Studio M2 Ultra',
      brand: 'Apple',
      SKU: 'APL-MS-M2ULTRA-64GB',
      categorySlug: 'workstation-pcs',
      description: 'Extensive connectivity, astonishing compact size, powered by 24-core CPU and 60-core GPU M2 Ultra.',
      price: 399900,
      originalPrice: 429900,
      discount: 6.98,
      stock: 5,
      rating: 4.9,
      reviewCount: 22,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
      ],
      specifications: { Processor: 'Apple M2 Ultra (24-Core)', RAM: '64 GB Unified', Storage: '1 TB SSD', GPU: '60-Core GPU', OS: 'macOS Sequoia' }
    },

    // 6. Gaming Monitors
    {
      name: 'Samsung Odyssey OLED G9 49" Curved',
      brand: 'Samsung',
      SKU: 'SAM-G95SC-OLED-49',
      categorySlug: 'gaming-monitors',
      description: 'Dual QHD 49-inch OLED gaming display with 240Hz refresh rate and 0.03ms response time.',
      price: 149999,
      originalPrice: 179999,
      discount: 16.67,
      stock: 7,
      rating: 4.9,
      reviewCount: 39,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
      ],
      specifications: { DisplaySize: '49 inch Curved 1800R', Panel: 'OLED Dual QHD (5120x1440)', RefreshRate: '240Hz', ResponseTime: '0.03ms', HDR: 'DisplayHDR True Black 400' }
    },
    {
      name: 'LG UltraGear 27" OLED 240Hz 1440p',
      brand: 'LG',
      SKU: 'LG-27GS95QE-OLED',
      categorySlug: 'gaming-monitors',
      description: '27-inch QHD OLED 240Hz 0.03ms gaming monitor with G-Sync Compatibility and Anti-Glare.',
      price: 79999,
      originalPrice: 89999,
      discount: 11.11,
      stock: 14,
      rating: 4.8,
      reviewCount: 77,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
      ],
      specifications: { DisplaySize: '27 inch Flat', Panel: 'OLED QHD (2560x1440)', RefreshRate: '240Hz', ResponseTime: '0.03ms', HDR: 'HDR10' }
    },
    {
      name: 'Dell Alienware AW3423DWF QD-OLED',
      brand: 'Dell',
      SKU: 'DEL-AW3423DWF-QDOLED',
      categorySlug: 'gaming-monitors',
      description: 'Quantum Dot OLED 34-inch curved ultra-wide gaming panel with infinite contrast and 165Hz rate.',
      price: 94999,
      originalPrice: 109999,
      discount: 13.64,
      stock: 9,
      rating: 4.9,
      reviewCount: 65,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
      ],
      specifications: { DisplaySize: '34 inch Curved 1800R', Panel: 'QD-OLED UWQHD (3440x1440)', RefreshRate: '165Hz', ResponseTime: '0.1ms', ColorCoverage: '99.3% DCI-P3' }
    },

    // 7. Professional Displays
    {
      name: 'Apple Studio Display 27" 5K Retina',
      brand: 'Apple',
      SKU: 'APL-STD-DISP-5K',
      categorySlug: 'professional-displays',
      description: '27-inch 5K Retina display with 12MP Ultra Wide camera, studio-quality mic array, and six-speaker sound.',
      price: 159900,
      originalPrice: 169900,
      discount: 5.89,
      stock: 10,
      rating: 4.7,
      reviewCount: 33,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
      ],
      specifications: { DisplaySize: '27 inch 5K', Panel: 'IPS LCD (5120 x 2880)', Brightness: '600 nits', Ports: '1x Thunderbolt 3, 3x USB-C', Audio: 'Six-speaker system with Spatial Audio' }
    },
    {
      name: 'Dell UltraSharp UP2720Q 27" 4K ColorPro',
      brand: 'Dell',
      SKU: 'DEL-UP2720Q-4K-CAL',
      categorySlug: 'professional-displays',
      description: 'Built-in colorimeter PremierColor monitor with Thunderbolt 3 connection and 100% Adobe RGB.',
      price: 119999,
      originalPrice: 134999,
      discount: 11.11,
      stock: 8,
      rating: 4.8,
      reviewCount: 20,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800'
      ],
      specifications: { DisplaySize: '27 inch 4K', Panel: 'IPS (3840 x 2160)', ColorGamut: '100% Adobe RGB, 98% DCI-P3', Calibration: 'Built-in Colorimeter', Ports: 'Thunderbolt 3 (90W PD)' }
    },

    // 8. Wireless Earbuds
    {
      name: 'Sony WF-1000XM5 Noise Canceling Earbuds',
      brand: 'Sony',
      SKU: 'SNY-WF1000XM5-BLK',
      categorySlug: 'wireless-earbuds',
      description: 'The best noise-canceling earbuds with Dynamic Driver X, multi-point connection, and 8 hours battery.',
      price: 24990,
      originalPrice: 29990,
      discount: 16.67,
      stock: 35,
      rating: 4.7,
      reviewCount: 154,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'
      ],
      specifications: { ANC: 'HD Noise Canceling Processor V2', BatteryLife: '8h + 16h with Case', AudioCodec: 'LDAC, AAC, SBC', WaterResistance: 'IPX4' }
    },
    {
      name: 'Apple AirPods Pro (2nd Gen) USB-C',
      brand: 'Apple',
      SKU: 'APL-APP2-USBC',
      categorySlug: 'wireless-earbuds',
      description: 'H2 chip power, up to 2x more Active Noise Cancellation, Adaptive Audio, and USB-C MagSafe Case.',
      price: 22900,
      originalPrice: 24900,
      discount: 8.03,
      stock: 50,
      rating: 4.9,
      reviewCount: 310,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'
      ],
      specifications: { Processor: 'Apple H2', ANC: 'Active Noise Cancellation + Transparency', BatteryLife: '6h + 24h with Case', Charging: 'USB-C / MagSafe / Apple Watch' }
    },
    {
      name: 'Bose QuietComfort Ultra Earbuds',
      brand: 'Bose',
      SKU: 'BOS-QC-ULTRA-EB',
      categorySlug: 'wireless-earbuds',
      description: 'Breakthrough spatialized audio for immersive listening, world-class noise cancellation, and CustomTune.',
      price: 25900,
      originalPrice: 29900,
      discount: 13.38,
      stock: 20,
      rating: 4.6,
      reviewCount: 89,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800'
      ],
      specifications: { ANC: 'CustomTune World-Class ANC', BatteryLife: '6h + 18h with Case', Audio: 'Bose Immersive Audio Spatial', Connectivity: 'Bluetooth 5.3' }
    },

    // 9. Over-Ear Headphones
    {
      name: 'Sony WH-1000XM5 Wireless ANC Headphones',
      brand: 'Sony',
      SKU: 'SNY-WH1000XM5-BLK',
      categorySlug: 'over-ear-headphones',
      description: 'Industry-leading noise canceling with 8 microphones, Auto NC Optimizer, and 30-hour battery life.',
      price: 29990,
      originalPrice: 34990,
      discount: 14.29,
      stock: 28,
      rating: 4.8,
      reviewCount: 240,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      ],
      specifications: { Drivers: '30mm Carbon Fiber', ANC: 'Integrated Processor V1', BatteryLife: '30 hours with ANC', Weight: '250g' }
    },
    {
      name: 'Apple AirPods Max Sky Blue',
      brand: 'Apple',
      SKU: 'APL-APM-SKYBLUE',
      categorySlug: 'over-ear-headphones',
      description: 'Apple-designed dynamic driver provides high-fidelity audio. Computational audio with H1 chips.',
      price: 59900,
      originalPrice: 59900,
      discount: 0.0,
      stock: 15,
      rating: 4.7,
      reviewCount: 110,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
      ],
      specifications: { Drivers: 'Apple Dynamic Driver', ANC: 'Active Noise Cancellation + Spatial Audio', BatteryLife: '20 hours', Weight: '384.8g' }
    },
    {
      name: 'Bose QuietComfort Ultra Headphones',
      brand: 'Bose',
      SKU: 'BOS-QCU-HEAD-BLK',
      categorySlug: 'over-ear-headphones',
      description: 'Flagship wireless headphones featuring Bose Immersive Audio, ANC modes, and ultra plush ear cushions.',
      price: 35900,
      originalPrice: 39900,
      discount: 10.03,
      stock: 19,
      rating: 4.7,
      reviewCount: 75,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
      ],
      specifications: { BatteryLife: '24 hours', Audio: 'Immersive Audio + Quiet Mode', Weight: '252g' }
    },

    // 10. Mechanical Keyboards
    {
      name: 'Keychron Q1 Max QMK/VIA Wireless Mechanical Keyboard',
      brand: 'Keychron',
      SKU: 'KCN-Q1MAX-BROWN',
      categorySlug: 'mechanical-keyboards',
      description: '75% Layout full aluminum custom wireless keyboard with 2.4GHz ultra-fast connection & Gateron Jupiter Brown switches.',
      price: 19999,
      originalPrice: 22999,
      discount: 13.04,
      stock: 22,
      rating: 4.9,
      reviewCount: 68,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'
      ],
      specifications: { Layout: '75% Compact', Body: 'CNC Aluminum Body', Switches: 'Gateron Jupiter Brown (Hot-Swappable)', Connectivity: '2.4GHz / Bluetooth 5.1 / Type-C', Keycaps: 'Double-Shot KSA PBT' }
    },
    {
      name: 'Logitech G915 LIGHTSPEED Wireless RGB Mechanical',
      brand: 'Logitech',
      SKU: 'LOG-G915-GL-TACTILE',
      categorySlug: 'mechanical-keyboards',
      description: 'Low profile mechanical switches, LIGHTSPEED wireless 1ms response, aircraft-grade aluminum alloy.',
      price: 21995,
      originalPrice: 24995,
      discount: 12.0,
      stock: 16,
      rating: 4.6,
      reviewCount: 95,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800'
      ],
      specifications: { Switches: 'GL Tactile Low Profile', Connectivity: 'LIGHTSPEED 1ms / Bluetooth', BatteryLife: '30 hours (100% RGB)', RGB: 'LIGHTSYNC Per-Key' }
    },
    {
      name: 'Corsair K100 RGB Optical-Mechanical Gaming Keyboard',
      brand: 'Corsair',
      SKU: 'CSR-K100-OPX',
      categorySlug: 'mechanical-keyboards',
      description: 'CORSAIR OPX optical-mechanical key switches with 1.0mm actuation, AXON hyper-processing technology at 4,000Hz.',
      price: 22499,
      originalPrice: 25999,
      discount: 13.46,
      stock: 12,
      rating: 4.8,
      reviewCount: 54,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'
      ],
      specifications: { Switches: 'CORSAIR OPX Optical-Mechanical', PollingRate: '4000Hz', Keycaps: 'PBT Double-Shot', Extras: 'iCUE Control Wheel, Magnetic Palm Rest' }
    },

    // 11. Precision Mice
    {
      name: 'Logitech MX Master 3S Wireless Ergonomic Mouse',
      brand: 'Logitech',
      SKU: 'LOG-MXM3S-GRAPHITE',
      categorySlug: 'precision-mice',
      description: 'An iconic master mouse remastered. 8K DPI sensor, Quiet Clicks technology, and MagSpeed electromagnetic scroll wheel.',
      price: 10995,
      originalPrice: 12495,
      discount: 12.0,
      stock: 45,
      rating: 4.9,
      reviewCount: 380,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'
      ],
      specifications: { Sensor: 'Darkfield 8000 DPI (Tracks on glass)', BatteryLife: '70 days on full charge', Connectivity: 'Logi Bolt / Bluetooth', ScrollWheel: 'MagSpeed Electromagnetic' }
    },
    {
      name: 'Razer Viper V3 Pro Ultra-lightweight Wireless Mouse',
      brand: 'Razer',
      SKU: 'RZR-VIPERV3PRO-BLK',
      categorySlug: 'precision-mice',
      description: '54g ultra-lightweight esports mouse with Focus Pro 35K Gen-2 Optical Sensor and 8000Hz wireless polling rate.',
      price: 15999,
      originalPrice: 17999,
      discount: 11.11,
      stock: 25,
      rating: 4.9,
      reviewCount: 88,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'
      ],
      specifications: { Weight: '54g', Sensor: 'Focus Pro 35K Optical Sensor Gen-2', PollingRate: 'True 8000Hz Wireless', BatteryLife: 'Up to 95 hours' }
    },

    // 12. Gaming Headsets
    {
      name: 'SteelSeries Arctis Nova Pro Wireless',
      brand: 'SteelSeries',
      SKU: 'STS-ARCTIS-NOVAPRO-W',
      categorySlug: 'gaming-headsets',
      description: 'Almighty Audio system, Active Noise Cancellation, Infinity Power System with dual hot-swappable batteries.',
      price: 36999,
      originalPrice: 39999,
      discount: 7.5,
      stock: 14,
      rating: 4.8,
      reviewCount: 92,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
      ],
      specifications: { Drivers: '40mm High Fidelity Drivers', ANC: 'Four-mic hybrid ANC system', Connection: 'Dual 2.4GHz + Bluetooth 5.0', BaseStation: 'OLED Wireless Base Station' }
    },
    {
      name: 'HyperX Cloud III Wireless Gaming Headset',
      brand: 'HyperX',
      SKU: 'HYP-CLOUD3-W-BLK',
      categorySlug: 'gaming-headsets',
      description: 'Up to 120 hours battery life, 53mm angled drivers tuned for gaming audio accuracy, ultra-plush memory foam.',
      price: 14990,
      originalPrice: 16990,
      discount: 11.77,
      stock: 30,
      rating: 4.7,
      reviewCount: 140,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1599669454699-248893623440?w=800'
      ],
      specifications: { Drivers: '53mm Angled Drivers', BatteryLife: 'Up to 120 Hours', Connection: '2.4GHz Wireless USB-C', Mic: '10mm Noise-Canceling Detachable' }
    },

    // 13. Controllers & Gamepads
    {
      name: 'Sony PlayStation DualSense Edge Wireless Controller',
      brand: 'Sony',
      SKU: 'SNY-DUALSENSE-EDGE',
      categorySlug: 'controllers-gamepads',
      description: 'Ultra-customizable pro controller with remappable buttons, tunable triggers & sticks, changeable stick modules.',
      price: 18990,
      originalPrice: 20990,
      discount: 9.53,
      stock: 20,
      rating: 4.8,
      reviewCount: 76,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800'
      ],
      specifications: { Features: 'Replaceable Stick Modules, Back Buttons, Trigger Lock Stop Switches', Connectivity: 'Bluetooth / USB-C Braided Cable' }
    },
    {
      name: 'Xbox Elite Wireless Controller Series 2',
      brand: 'Microsoft',
      SKU: 'MSF-XBOX-ELITE-S2',
      categorySlug: 'controllers-gamepads',
      description: 'Adjustable-tension thumbsticks, wrap-around rubberized grip, shorter hair trigger locks, up to 40h battery.',
      price: 15990,
      originalPrice: 17990,
      discount: 11.12,
      stock: 18,
      rating: 4.6,
      reviewCount: 115,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800'
      ],
      specifications: { BatteryLife: 'Up to 40 hours', Customization: '4 Paddles, 6 Thumbsticks, 2 D-Pads', Weight: '345g' }
    },

    // 14. Internal NVMe SSDs
    {
      name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD with Heatsink',
      brand: 'Samsung',
      SKU: 'SAM-990PRO-2TB-HS',
      categorySlug: 'internal-nvme-ssds',
      description: 'Blazing speed up to 7450 MB/s read and 6900 MB/s write. PS5 compatible with pre-installed slim heatsink.',
      price: 18499,
      originalPrice: 22999,
      discount: 19.57,
      stock: 40,
      rating: 4.9,
      reviewCount: 210,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'
      ],
      specifications: { Capacity: '2 TB', Interface: 'PCIe Gen 4.0 x4, NVMe 2.0', ReadSpeed: '7,450 MB/s', WriteSpeed: '6,900 MB/s', FormFactor: 'M.2 2280 with Heatsink' }
    },
    {
      name: 'WD Black SN850X 4TB NVMe Gaming SSD',
      brand: 'Western Digital',
      SKU: 'WDC-SN850X-4TB',
      categorySlug: 'internal-nvme-ssds',
      description: 'Crush load times with 7,300 MB/s top performance for hardcore gamers and creative video editors.',
      price: 36999,
      originalPrice: 42999,
      discount: 13.95,
      stock: 15,
      rating: 4.9,
      reviewCount: 84,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'
      ],
      specifications: { Capacity: '4 TB', Interface: 'PCIe Gen 4.0 x4', ReadSpeed: '7,300 MB/s', WriteSpeed: '6,600 MB/s', Endurace: '2400 TBW' }
    },
    {
      name: 'Crucial T700 2TB Gen5 NVMe SSD (12,400 MB/s)',
      brand: 'Crucial',
      SKU: 'CRL-T700-2TB-GEN5',
      categorySlug: 'internal-nvme-ssds',
      description: 'Next-gen PCIe 5.0 speeds up to 12,400 MB/s sequential reads for extreme performance PCs.',
      price: 28999,
      originalPrice: 32999,
      discount: 12.12,
      stock: 10,
      rating: 4.8,
      reviewCount: 36,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'
      ],
      specifications: { Capacity: '2 TB', Interface: 'PCIe Gen 5.0 x4', ReadSpeed: '12,400 MB/s', WriteSpeed: '11,800 MB/s' }
    },

    // 15. External Drives
    {
      name: 'SanDisk 2TB Extreme Portable SSD V2 USB 3.2 Gen 2',
      brand: 'SanDisk',
      SKU: 'SND-EXTREME-2TB-V2',
      categorySlug: 'external-drives',
      description: 'High-speed 1050 MB/s read transfers in a rugged, IP65 water & dust resistant rubber shell.',
      price: 15499,
      originalPrice: 19999,
      discount: 22.5,
      stock: 35,
      rating: 4.8,
      reviewCount: 195,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800'
      ],
      specifications: { Capacity: '2 TB', Interface: 'USB 3.2 Gen 2 (10Gbps)', ReadSpeed: '1,050 MB/s', Protection: 'IP65 Water/Dust, 3m Drop Protection' }
    },
    {
      name: 'Samsung T7 Shield 4TB Portable SSD Dark Gray',
      brand: 'Samsung',
      SKU: 'SAM-T7S-4TB-GY',
      categorySlug: 'external-drives',
      description: 'Tough, fast, and compact external drive with IP65 rating and dynamic thermal guard protection.',
      price: 31999,
      originalPrice: 38999,
      discount: 17.95,
      stock: 16,
      rating: 4.9,
      reviewCount: 92,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800'
      ],
      specifications: { Capacity: '4 TB', Interface: 'USB 3.2 Gen 2', ReadSpeed: '1,050 MB/s', Encryption: 'AES 256-bit Hardware Encryption' }
    },

    // 16. USB-C Docks & Hubs
    {
      name: 'Anker 778 Thunderbolt 4 Docking Station 12-in-1',
      brand: 'Anker',
      SKU: 'ANK-778-TB4-DOCK',
      categorySlug: 'usbc-docks-hubs',
      description: '12 ports including Thunderbolt 4 upstream 40Gbps, 90W laptop charging, quad monitor support via 8K HDMI & DisplayPort.',
      price: 29999,
      originalPrice: 34999,
      discount: 14.29,
      stock: 12,
      rating: 4.7,
      reviewCount: 48,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1616440342231-50795c7324ec?w=800'
      ],
      specifications: { Ports: '1x TB4 Upstream, 1x TB4 Downstream, 2x DisplayPort 1.4, 1x HDMI 2.1, 4x USB-A, 2.5G Ethernet', Charging: '90W Pass-Through' }
    },
    {
      name: 'Satechi Aluminum Type-C Pro Hub Max',
      brand: 'Satechi',
      SKU: 'SAT-PROHUB-MAX-SLV',
      categorySlug: 'usbc-docks-hubs',
      description: 'Dual Type-C adapter designed specifically for MacBook Pro M1/M2/M3 with 4K HDMI, Gigabit Ethernet, and SD card reader.',
      price: 8990,
      originalPrice: 10990,
      discount: 18.2,
      stock: 25,
      rating: 4.6,
      reviewCount: 72,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1616440342231-50795c7324ec?w=800'
      ],
      specifications: { HDMI: '4K @ 60Hz', 'USB Ports': 'USB4 (100W PD), USB-A 3.0, USB-C Data', CardReader: 'Micro/SD Card Reader' }
    },

    // 17. Power & Cables
    {
      name: 'Anker Prime 20,000mAh Power Bank (200W Output)',
      brand: 'Anker',
      SKU: 'ANK-PRIME-200W-20K',
      categorySlug: 'power-cables',
      description: 'Ultra-high power bank with 200W total output, smart digital display app control, charges two laptops simultaneously.',
      price: 12999,
      originalPrice: 14999,
      discount: 13.33,
      stock: 30,
      rating: 4.9,
      reviewCount: 145,
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1609592424074-25e40e6c51ef?w=800'
      ],
      specifications: { Capacity: '20,000 mAh', TotalOutput: '200W Max', OutputPorts: '2x USB-C (100W each), 1x USB-A (65W)', Screen: 'Smart Digital Color Display' }
    },
    {
      name: 'Anker 737 GaNPrime 120W USB-C Wall Charger',
      brand: 'Anker',
      SKU: 'ANK-737-120W-GAN',
      categorySlug: 'power-cables',
      description: 'Compact 3-port fast wall charger with GaNPrime architecture, PowerIQ 4.0 dynamic power distribution.',
      price: 7499,
      originalPrice: 8999,
      discount: 16.67,
      stock: 45,
      rating: 4.8,
      reviewCount: 220,
      featured: false,
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800'
      ],
      specifications: { Ports: '2x USB-C, 1x USB-A', MaxOutput: '120W', Tech: 'GaNPrime, ActiveShield 2.0' }
    }
  ];

  console.log(`📦 Seeding ${productsRaw.length} products...`);

  let seededProductsCount = 0;
  const productIds: string[] = [];

  for (const item of productsRaw) {
    const categoryId = categoryMap[item.categorySlug];
    if (!categoryId) {
      console.warn(`⚠️ Warning: Category slug "${item.categorySlug}" not found for product "${item.name}". Skipping.`);
      continue;
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: item.name,
        slug: toSlug(item.name) + '-' + Math.floor(1000 + Math.random() * 9000),
        brand: item.brand,
        SKU: item.SKU,
        description: item.description,
        price: item.price,
        originalPrice: item.originalPrice,
        discount: item.discount,
        stock: item.stock,
        rating: item.rating,
        reviewCount: item.reviewCount,
        images: item.images,
        specifications: item.specifications,
        categoryId: categoryId,
        featured: item.featured,
        active: true,
      },
    });

    productIds.push(createdProduct.id);
    seededProductsCount++;
  }

  console.log(`✅ Seeded ${seededProductsCount} products across ${Object.keys(categoryMap).length} categories.`);

  // Create sample customer reviews
  if (productIds.length > 0) {
    const reviewData = [
      { rating: 5, comment: 'Absolute beast of a machine! Exceeded all my expectations for work and gaming.' },
      { rating: 5, comment: 'Build quality is top tier. Shipping was fast from TechNova.' },
      { rating: 4, comment: 'Great product overall, battery life is slightly lower than advertised but performance is incredible.' },
      { rating: 5, comment: 'Completely changed my daily setup. 10/10 recommendation.' },
    ];

    for (let i = 0; i < Math.min(6, productIds.length); i++) {
      const pId = productIds[i];
      const rev = reviewData[i % reviewData.length];
      await prisma.review.create({
        data: {
          userId: customer.id,
          productId: pId,
          rating: rev.rating,
          comment: rev.comment,
        },
      });
    }
    console.log('⭐ Seeded product reviews.');
  }

  // Create sample Wishlist & Cart for Customer
  const customerWishlist = await prisma.wishlist.create({
    data: {
      userId: customer.id,
    },
  });

  if (productIds.length >= 2) {
    await prisma.wishlistItem.createMany({
      data: [
        { wishlistId: customerWishlist.id, productId: productIds[0] },
        { wishlistId: customerWishlist.id, productId: productIds[1] },
      ],
    });
  }

  const customerCart = await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  if (productIds.length >= 3) {
    await prisma.cartItem.createMany({
      data: [
        { cartId: customerCart.id, productId: productIds[2], quantity: 1 },
      ],
    });
  }

  // Create sample Customer Address
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Rahul Sharma',
      phone: '+91 9876543210',
      addressLine1: 'Flat 402, Silicon Heights',
      addressLine2: 'Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
      isDefault: true,
    },
  });

  console.log('🛒 Seeded Wishlist, Cart, and Address for Customer.');

  // Create sample past Order
  if (productIds.length >= 2) {
    const sampleProduct = await prisma.product.findUnique({ where: { id: productIds[0] } });
    if (sampleProduct) {
      const orderSubtotal = sampleProduct.price;
      const orderTotal = sampleProduct.price;

      await prisma.order.create({
        data: {
          orderNumber: 'TN-' + Math.floor(100000 + Math.random() * 900000),
          userId: customer.id,
          addressId: address.id,
          addressSnapshot: {
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
          subtotal: orderSubtotal,
          discount: 0,
          total: orderTotal,
          status: OrderStatus.CONFIRMED,
          items: {
            create: [
              {
                productId: sampleProduct.id,
                productName: sampleProduct.name,
                SKU: sampleProduct.SKU,
                unitPrice: sampleProduct.price,
                quantity: 1,
                totalPrice: sampleProduct.price,
                image: (sampleProduct.images as string[])[0] || '',
              },
            ],
          },
        },
      });
      console.log('📦 Seeded initial customer order.');
    }
  }

  console.log('🎉 TechNova Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
