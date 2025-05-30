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
        Schema::create('live_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('live_class_category_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('zoom_meeting_id')->nullable();
            $table->string('zoom_join_url')->nullable();
            $table->string('zoom_start_url')->nullable();
            $table->string('zoom_password')->nullable();

            // Scheduling
            $table->enum('day_of_week', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $table->time('start_time');
            $table->string('timezone', 50)->default('Asia/Colombo');
            $table->enum('repeat_frequency', ['daily', 'weekly', 'monthly']);

            // Subscription
            $table->decimal('subscription_fee', 10, 2);
            $table->enum('subscription_duration_type', ['day', 'week', 'month', 'year']);
            $table->integer('subscription_duration_value')->default(1);

            // Status
            $table->boolean('is_active')->default(true);
            $table->datetime('starts_at')->nullable();
            $table->datetime('ends_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_classes');
    }
};
