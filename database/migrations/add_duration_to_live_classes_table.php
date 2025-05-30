<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->integer('duration_minutes')->default(60)->after('start_time');
        });
    }

    public function down()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->dropColumn('duration_minutes');
        });
    }
};
