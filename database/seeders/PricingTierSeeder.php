<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PricingTier;

class PricingTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pricingTiers = [
            [
                'name' => 'Free',
                'tier_number' => 0,
                'price' => 0.00,
                'description' => 'Perfect for getting started',
                'features' => ['Basic access', 'Limited features', 'Community support'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 1
            ],
            [
                'name' => 'Tier 1',
                'tier_number' => 1,
                'price' => 19.99,
                'description' => 'Great for individuals',
                'features' => ['All basic features', 'Email support', 'Advanced tools'],
                'is_active' => true,
                'is_popular' => true,
                'sort_order' => 2
            ],
            [
                'name' => 'Tier 2',
                'tier_number' => 2,
                'price' => 22.99,
                'description' => 'Perfect for small teams',
                'features' => ['All Tier 1 features', 'Team collaboration', 'Priority support'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 3
            ],
            [
                'name' => 'Tier 3',
                'tier_number' => 3,
                'price' => 24.90,
                'description' => 'Enhanced productivity',
                'features' => ['All Tier 2 features', 'Advanced analytics', 'Custom integrations'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 4
            ],
            [
                'name' => 'Tier 4',
                'tier_number' => 4,
                'price' => 27.00,
                'description' => 'Professional solution',
                'features' => ['All Tier 3 features', 'API access', 'Custom branding'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 5
            ],
            [
                'name' => 'Tier 5',
                'tier_number' => 5,
                'price' => 29.99,
                'description' => 'Advanced features',
                'features' => ['All Tier 4 features', 'White labeling', 'Dedicated support'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 6
            ],
            [
                'name' => 'Tier 6',
                'tier_number' => 6,
                'price' => 34.99,
                'description' => 'Enterprise ready',
                'features' => ['All Tier 5 features', 'SSO integration', 'Advanced security'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 7
            ],
            [
                'name' => 'Tier 7',
                'tier_number' => 7,
                'price' => 39.99,
                'description' => 'Premium experience',
                'features' => ['All Tier 6 features', 'Custom workflows', 'Premium templates'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 8
            ],
            [
                'name' => 'Tier 8',
                'tier_number' => 8,
                'price' => 44.99,
                'description' => 'Maximum efficiency',
                'features' => ['All Tier 7 features', 'AI assistance', 'Automation tools'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 9
            ],
            [
                'name' => 'Tier 9',
                'tier_number' => 9,
                'price' => 49.90,
                'description' => 'Elite performance',
                'features' => ['All Tier 8 features', 'Advanced AI', 'Predictive analytics'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 10
            ],
            [
                'name' => 'Tier 10',
                'tier_number' => 10,
                'price' => 54.99,
                'description' => 'Ultimate solution',
                'features' => ['All Tier 9 features', 'Machine learning', 'Custom algorithms'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 11
            ],
            [
                'name' => 'Tier 11',
                'tier_number' => 11,
                'price' => 59.99,
                'description' => 'Professional plus',
                'features' => ['All Tier 10 features', 'Advanced reporting', 'Data visualization'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 12
            ],
            [
                'name' => 'Tier 12',
                'tier_number' => 12,
                'price' => 64.99,
                'description' => 'Enterprise grade',
                'features' => ['All Tier 11 features', 'Multi-region support', 'Compliance tools'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 13
            ],
            [
                'name' => 'Tier 13',
                'tier_number' => 13,
                'price' => 69.99,
                'description' => 'Advanced enterprise',
                'features' => ['All Tier 12 features', 'Global deployment', 'Advanced compliance'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 14
            ],
            [
                'name' => 'Tier 14',
                'tier_number' => 14,
                'price' => 74.99,
                'description' => 'Premium enterprise',
                'features' => ['All Tier 13 features', 'Dedicated infrastructure', 'SLA guarantee'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 15
            ],
            [
                'name' => 'Tier 15',
                'tier_number' => 15,
                'price' => 79.99,
                'description' => 'Elite enterprise',
                'features' => ['All Tier 14 features', 'Custom development', '24/7 phone support'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 16
            ],
            [
                'name' => 'Tier 16',
                'tier_number' => 16,
                'price' => 84.99,
                'description' => 'Ultimate enterprise',
                'features' => ['All Tier 15 features', 'Unlimited customization', 'Onsite support'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 17
            ],
            [
                'name' => 'Tier 17',
                'tier_number' => 17,
                'price' => 89.99,
                'description' => 'Maximum performance',
                'features' => ['All Tier 16 features', 'Performance optimization', 'Load balancing'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 18
            ],
            [
                'name' => 'Tier 18',
                'tier_number' => 18,
                'price' => 94.90,
                'description' => 'Premium performance',
                'features' => ['All Tier 17 features', 'CDN optimization', 'Global edge computing'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 19
            ],
            [
                'name' => 'Tier 20',
                'tier_number' => 20,
                'price' => 100.99,
                'description' => 'Centennial package',
                'features' => ['All Tier 18 features', 'Quantum computing access', 'Future-proof technology'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 20
            ],
            [
                'name' => 'Tier 21',
                'tier_number' => 21,
                'price' => 119.99,
                'description' => 'Next generation',
                'features' => ['All Tier 20 features', 'Blockchain integration', 'Decentralized features'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 21
            ],
            [
                'name' => 'Tier 22',
                'tier_number' => 22,
                'price' => 124.99,
                'description' => 'Future ready',
                'features' => ['All Tier 21 features', 'IoT integration', 'Edge AI processing'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 22
            ],
            [
                'name' => 'Tier 23',
                'tier_number' => 23,
                'price' => 129.99,
                'description' => 'Advanced future',
                'features' => ['All Tier 22 features', 'Augmented reality', 'Virtual reality support'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 23
            ],
            [
                'name' => 'Tier 24',
                'tier_number' => 24,
                'price' => 139.99,
                'description' => 'Premium future',
                'features' => ['All Tier 23 features', 'Metaverse integration', 'Immersive experiences'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 24
            ],
            [
                'name' => 'Tier 25',
                'tier_number' => 25,
                'price' => 149.99,
                'description' => 'Ultimate future',
                'features' => ['All Tier 24 features', 'Neural interfaces', 'Brain-computer interaction'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 25
            ],
            [
                'name' => 'Tier 26',
                'tier_number' => 26,
                'price' => 159.90,
                'description' => 'Transcendent solution',
                'features' => ['All Tier 25 features', 'Consciousness mapping', 'Digital immortality'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 26
            ],
            [
                'name' => 'Tier 27',
                'tier_number' => 27,
                'price' => 174.99,
                'description' => 'Cosmic level',
                'features' => ['All Tier 26 features', 'Multiverse access', 'Parallel universe sync'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 27
            ],
            [
                'name' => 'Tier 28',
                'tier_number' => 28,
                'price' => 189.90,
                'description' => 'Galactic premium',
                'features' => ['All Tier 27 features', 'Intergalactic communication', 'Alien tech integration'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 28
            ],
            [
                'name' => 'Tier 29',
                'tier_number' => 29,
                'price' => 199.99,
                'description' => 'Universal ultimate',
                'features' => ['All Tier 28 features', 'God mode access', 'Reality manipulation'],
                'is_active' => true,
                'is_popular' => false,
                'sort_order' => 29
            ]
        ];

        foreach ($pricingTiers as $tier) {
            PricingTier::create($tier);
        }
    }
}
