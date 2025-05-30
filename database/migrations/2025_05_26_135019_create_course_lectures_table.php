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
        Schema::create('course_lectures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('section_id')->constrained('course_sections')->onDelete('cascade');
            $table->string('title');
            $table->text('content')->nullable(); // Text content
            $table->string('video_path')->nullable();
            $table->string('youtube_video_id')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('youtube_embed_url')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->integer('duration')->nullable(); // in seconds
            $table->integer('sort_order')->default(0);
            $table->integer('lecture_number')->default(1);
            $table->boolean('is_preview')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['course_id', 'section_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_lectures');
    }
};
