<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->string('monthly_week')->nullable()->after('repeat_frequency');
        });
    }

    public function down()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->dropColumn('monthly_week');
        });
    }
};
