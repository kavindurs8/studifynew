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
        Schema::create('live_class_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "AL Theory", "AL Revision", "OL Theory", "OL Revision"
            $table->year('year'); // e.g., 2025, 2026
            $table->enum('level', ['AL', 'OL']); // Advanced Level or Ordinary Level
            $table->enum('type', ['Theory', 'Revision']); // Theory or Revision classes
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Add unique constraint to prevent duplicate combinations
            $table->unique(['year', 'level', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_class_categories');
    }
};
