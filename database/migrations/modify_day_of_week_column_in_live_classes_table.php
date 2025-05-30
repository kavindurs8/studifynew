<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            // Change day_of_week to a longer varchar or text
            $table->string('day_of_week', 50)->change(); // Increase from default to 50 characters
        });
    }

    public function down()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->string('day_of_week', 20)->change(); // Back to smaller size
        });
    }
};
