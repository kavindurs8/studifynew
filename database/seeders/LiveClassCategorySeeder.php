<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LiveClassCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => '2025 - AL Theory',
                'year' => 2025,
                'level' => 'AL',
                'type' => 'Theory',
                'description' => 'Advanced Level Theory classes for 2025',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2026 - AL Revision',
                'year' => 2026,
                'level' => 'AL',
                'type' => 'Revision',
                'description' => 'Advanced Level Revision classes for 2026',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2025 - OL Theory',
                'year' => 2025,
                'level' => 'OL',
                'type' => 'Theory',
                'description' => 'Ordinary Level Theory classes for 2025',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '2026 - OL Revision',
                'year' => 2026,
                'level' => 'OL',
                'type' => 'Revision',
                'description' => 'Ordinary Level Revision classes for 2026',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('live_class_categories')->insert($categories);
    }
}
