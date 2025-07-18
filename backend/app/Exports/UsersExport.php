<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UsersExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithEvents, ShouldAutoSize
{
    private int $index = 0;

    public function collection(): Collection
    {
        return User::select(['name', 'email', 'phone', 'created_at'])->get();
    }

    public function map($row): array
    {
        return [
            ++$this->index,
            $row->name,
            $row->email,
            $row->phone,
            $row->created_at->format('d/m/Y H:i'),
        ];
    }

    public function headings(): array
    {
        return ['#', 'Name', 'Email', 'Phone', 'Created At'];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            // Bold header
            1 => ['font' => ['bold' => true]],

            // Optional: center alignment
            'A' => ['alignment' => ['horizontal' => 'center']],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $rowCount = User::count() + 1; // 1 for heading

                $cellRange = 'A1:E' . $rowCount;

                // Borders for all cells
                $sheet->getStyle($cellRange)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['argb' => '000000'],
                        ],
                    ],
                    'alignment' => [
                        'vertical' => 'center',
                        'horizontal' => 'left',
                    ],
                    'font' => [
                        'name' => 'Calibri',
                        'size' => 11,
                    ],
                ]);

                // Optionally set background color for header
                $sheet->getStyle('A1:E1')->applyFromArray([
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['argb' => 'F1F1F1'],
                    ],
                ]);
            }
        ];
    }
}
