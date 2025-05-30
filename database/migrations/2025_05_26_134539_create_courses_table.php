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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->text('intended_learners')->nullable();
            $table->json('learning_objectives')->nullable(); // Array of 4+ objectives
            $table->text('requirements')->nullable();
            $table->text('target_audience')->nullable();
            $table->foreignId('pricing_tier_id')->nullable()->constrained('pricing_tiers');
            $table->decimal('price', 8, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected'])->default('draft');
            $table->text('rejection_reason')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced
            $table->string('language')->default('english');
            $table->integer('total_duration')->default(0); // in seconds
            $table->integer('total_lectures')->default(0);
            $table->integer('total_quizzes')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['teacher_id', 'status']);
            $table->index(['category', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
