import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getPriceFormmated } from '@/lib/formatters';

import { LogoBase64 } from '@/components/fetch/logo';

import { getLabelService } from '@/constant/services';

import { Transaction } from '@/types/api';

interface DataTotalResponse {
  totalPrice: string;
  totalWeight: string;
  totalDeposit: string;
  totalAmountPayment: string;
  totalAmountPaymentToday: string;
}
const PdfGenerator = (data: Transaction[], summary: DataTotalResponse) => {
  const listData = [
    ...data.map((item, i) => [
      i + 1,
      item.notaId,
      item.name,
      getLabelService(item.service),
      item.status,
      item.amountPayment,
      item.price,
    ]),
  ];

  function downloadInvoice() {
    const doc = new jsPDF();
    doc.addImage(LogoBase64, 'JPEG', 10, 5, 20, 20);
    doc.setLineWidth(1);
    doc.line(10, 30, 200, 30);

    autoTable(doc, {
      startY: 6,
      margin: {
        left: 32,
      },
      body: [
        [
          {
            content:
              'Printed by' +
              'Administator' +
              '\nTrees Clean Laundry' +
              '\nJL. Tombolotutu No 9B' +
              '\n94118',
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [
        ['No.', 'No. Nota', 'Name', 'Category', 'Status', 'Paid', 'Total'],
      ],
      body: listData,
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Total Weight:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: summary.totalWeight + ' Kg',
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Total Omzet: ',
            styles: {
              halign: 'right',
            },
          },
          {
            content: getPriceFormmated(parseInt(summary.totalPrice)),
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Total Payment: ',
            styles: {
              halign: 'right',
            },
          },
          {
            content: getPriceFormmated(parseInt(summary.totalAmountPayment)),
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Total deposit:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: getPriceFormmated(parseInt(summary.totalDeposit)),
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Print at : ' + new Date().toLocaleString('id'),
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    return doc.save('invoice');
  }
  downloadInvoice();
};

export default PdfGenerator;
