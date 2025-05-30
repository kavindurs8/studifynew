<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@studify.com',
            'password' => Hash::make('password123'), // Change this to a secure password
            'role' => Admin::ROLE_SUPER_ADMIN,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'name' => 'System Admin',
            'email' => 'system@studify.com',
            'password' => Hash::make('password123'), // Change this to a secure password
            'role' => Admin::ROLE_ADMIN,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
