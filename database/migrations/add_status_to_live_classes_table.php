<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected'])
                  ->default('draft')
                  ->after('is_active');
        });
    }

    public function down()
    {
        Schema::table('live_classes', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
