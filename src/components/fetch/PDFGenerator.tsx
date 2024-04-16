import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getDateFormatted, getPriceFormmated } from '@/lib/formatters';

import { LogoBase64 } from '@/components/fetch/logo';

import {
  getLabelService,
  getServicePrice,
  isServiceExpress,
} from '@/constant/services';

import { Transaction } from '@/types/api';
const PdfGenerator = (data: Transaction) => {
  function downloadInvoice() {
    const doc = new jsPDF();
    const paymentStatus =
      data.datePayment != '' && data.datePayment != undefined
        ? 'Dibayar Pada: ' + getDateFormatted(data.datePayment)
        : 'Belum Lunas';
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
              'From:' +
              data.cashier +
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
      startY: 6,
      body: [
        [
          {
            content:
              'Reference: ' +
              data.transactionId +
              '\nDate: ' +
              getDateFormatted(data.dateIn) +
              '\nInvoice number: ' +
              data.notaId,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      startY: 34,
      margin: {
        top: 8,
      },
      body: [
        [
          {
            content:
              'Billed to:' +
              '\n' +
              data.name +
              '\n' +
              data.address +
              '\n' +
              data.noTelp +
              '\nIndonesia',
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['Items', 'Category', 'Berat', 'Harga(kg)', 'Total']],
      body: [
        [
          getLabelService(data.service),
          isServiceExpress(data.service) ? 'Express' : 'Reguler',
          data.weight,
          getServicePrice(data.service)?.toString(),
          data.price,
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Total Harga',
            styles: {
              halign: 'right',
              fontSize: 11,
            },
          },
        ],
        [
          {
            content: getPriceFormmated(Number(data.price)),
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#3366ff',
            },
          },
        ],
        [
          {
            content: paymentStatus,
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
            content: 'Subtotal:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: getPriceFormmated(Number(data.price)),
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Total tax:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 0,
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: 'Total amount:',
            styles: {
              halign: 'right',
            },
          },
          {
            content: getPriceFormmated(Number(data.price)),
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
            content: 'Terms & notes',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content:
              'Nota ini dibuat berdasarkan nota fisik yang telah diterima oleh pembeli' +
              '\n' +
              'Harap mencocokkan kembali.' +
              '\n' +
              'No.Telp: 08123456789',
            styles: {
              halign: 'left',
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
            content: 'This is a centered footer',
            styles: {
              halign: 'center',
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
