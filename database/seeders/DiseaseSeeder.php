<?php

namespace Database\Seeders;

use App\Models\Disease;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DiseaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disease classes from trained CNN model (class_names.json)
        // Names must match EXACTLY with Python training output
        $diseases = [
            [
                'name' => 'Bacterial leaf blight',
                'name_scientific' => 'Xanthomonas oryzae pv. oryzae',
                'description' => 'Hawar Daun Bakteri (HDB) adalah penyakit padi yang disebabkan oleh bakteri Xanthomonas oryzae. Penyakit ini merupakan salah satu penyakit paling merusak pada tanaman padi di Asia.',
                'symptoms' => 'Gejala dimulai dengan bercak kuning pada tepi daun yang kemudian meluas membentuk lesi memanjang berwarna kuning hingga putih. Daun yang terinfeksi menjadi layu dan mengering dari ujung. Pada serangan berat, seluruh daun dapat mati dan tanaman mengalami kematian dini.',
                'causes' => 'Penyakit ini disebabkan oleh bakteri Xanthomonas oryzae pv. oryzae. Bakteri menyebar melalui air irigasi, percikan air hujan, dan alat-alat pertanian yang terkontaminasi. Kondisi lembab dan suhu hangat mendukung perkembangan penyakit.',
                'treatment' => 'Gunakan bakterisida berbahan aktif streptomycin atau kasugamycin. Cabut dan musnahkan tanaman yang terinfeksi parah. Atur jarak tanam yang baik untuk sirkulasi udara. Kurangi penggunaan pupuk nitrogen berlebihan.',
                'prevention' => 'Gunakan varietas tahan seperti Code, Cisadane, atau IR64. Lakukan rotasi tanaman. Jaga kebersihan lahan dan alat pertanian. Atur pengairan yang baik dan hindari genangan berlebihan. Perhatikan waktu tanam yang tepat.',
            ],
            [
                'name' => 'Brown spot',
                'name_scientific' => 'Bipolaris oryzae',
                'description' => 'Bercak Coklat adalah penyakit jamur yang menyerang daun padi dan dapat menyebabkan penurunan hasil panen yang signifikan terutama pada kondisi kekurangan nutrisi.',
                'symptoms' => 'Bercak berbentuk oval hingga bulat berwarna coklat dengan tepi kekuningan muncul pada daun. Bercak berukuran 0.5-2 cm dengan bagian tengah berwarna abu-abu. Pada serangan berat, bercak dapat menyatu dan menyebabkan daun mengering.',
                'causes' => 'Disebabkan oleh jamur Bipolaris oryzae (syn. Helminthosporium oryzae). Jamur berkembang optimal pada kondisi kelembaban tinggi dan suhu 25-30°C. Tanaman yang kekurangan nutrisi terutama kalium dan silikon lebih rentan.',
                'treatment' => 'Aplikasi fungisida berbahan aktif mancozeb, propiconazole, atau azoxystrobin. Perbaiki kesuburan tanah dengan pemupukan berimbang. Semprot dengan larutan kalium untuk memperkuat ketahanan tanaman.',
                'prevention' => 'Gunakan benih sehat dan bersertifikat. Perlakuan benih dengan fungisida sebelum tanam. Berikan pupuk lengkap terutama kalium dan fosfor. Jaga keseimbangan air dan hindari stress kekeringan. Pilih varietas tahan.',
            ],
            [
                'name' => 'Leaf smut',
                'name_scientific' => 'Entyloma oryzae',
                'description' => 'Jamur Daun adalah penyakit yang menyebabkan bercak hitam kecil pada permukaan daun padi, umumnya tidak terlalu merusak kecuali pada serangan berat.',
                'symptoms' => 'Bercak kecil hitam atau coklat gelap berbentuk bulat atau lonjong berukuran 0.5-5 mm tersebar pada permukaan daun. Bercak sedikit menonjol dan berisi spora jamur berwarna hitam. Daun tetap relatif hijau di sekitar bercak.',
                'causes' => 'Disebabkan oleh jamur Entyloma oryzae. Berkembang pada kondisi lembab dan suhu moderat. Spora tersebar melalui angin dan percikan air. Tanaman lemah lebih rentan terserang.',
                'treatment' => 'Biasanya tidak memerlukan pengendalian khusus karena kerusakannya ringan. Pada serangan berat, aplikasi fungisida sistemik dapat membantu. Tingkatkan kesehatan tanaman dengan pemupukan tepat.',
                'prevention' => 'Jaga kesuburan tanah dengan pemupukan berimbang. Gunakan benih sehat. Hindari kepadatan tanaman berlebihan. Jaga sirkulasi udara yang baik dengan pengaturan jarak tanam.',
            ],
        ];

        foreach ($diseases as $disease) {
            Disease::create([
                ...$disease,
                'slug' => Str::slug($disease['name']),
            ]);
        }
    }
}
