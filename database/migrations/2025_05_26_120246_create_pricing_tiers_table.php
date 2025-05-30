<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pricing_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Free", "Tier 1", "Tier 2", etc.
            $table->integer('tier_number'); // 0, 1, 2, 3, etc.
            $table->decimal('price', 8, 2); // Price with 2 decimal places
            $table->string('currency', 3)->default('USD');
            $table->text('description')->nullable();
            $table->json('features')->nullable(); // Store features as JSON
            $table->boolean('is_active')->default(true);
            $table->boolean('is_popular')->default(false); // Highlight popular tiers
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_tiers');
    }
};
