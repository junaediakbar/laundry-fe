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
export const props = {
  outputType: 'save',
  fileName: 'Invoice 2021',
  orientationLandscape: false,
  logo: {
    src: 'https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png',
    width: 53.33, //aspect ratio = width/height
    height: 26.66,
  },
  business: {
    name: 'Business Name',
    address: 'Albania, Tirane ish-Dogana, Durres 2001',
    phone: '(+355) 069 11 11 111',
    email: 'email@example.com',
    email_1: 'info@example.al',
    website: 'www.example.al',
  },
  contact: {
    label: 'Invoice issued for:',
    name: 'Client Name',
    address: 'Albania, Tirane, Astir',
    phone: '(+355) 069 22 22 222',
    email: 'client@website.al',
    otherInfo: 'www.website.al',
  },
  invoice: {
    label: 'Invoice #: ',
    invTotalLabel: 'Total:',
    num: 19,
    invDate: 'Payment Date: 01/01/2021 18:12',
    invGenDate: 'Invoice Date: 02/02/2021 10:17',
    header: ['#', 'Description', 'Price', 'Quantity', 'Unit', 'Total'],
    headerBorder: false,
    tableBodyBorder: false,
    table: Array.from(Array(10), (item, index) => ({
      num: index + 1,
      desc: 'There are many variations ',
      price: 200.5,
      quantity: 4.5,
      unit: 'm2',
      total: 400.5,
    })),
    invTotal: '145,250.50',
    invCurrency: 'ALL',
    invDescLabel: 'Invoice Note',
    invDesc:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
  },
  footer: {
    text: 'The invoice is created on a computer and is valid without the signature and stamp.',
  },
  pageEnable: true,
  pageLabel: 'Page ',
};
const PdfGenerator = (data: Transaction) => {
  function downloadInvoice() {
    const doc = new jsPDF();
    doc.addImage(LogoBase64, 'JPEG', 10, 5, 20, 20);
    doc.setLineWidth(1);
    doc.line(10, 30, 200, 30);

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Company brand',
    //         styles: {
    //           halign: 'left',
    //           fontSize: 20,
    //           textColor: '#ffffff',
    //         },
    //       },
    //       {
    //         content: 'Invoice',
    //         styles: {
    //           halign: 'right',
    //           fontSize: 20,
    //           textColor: '#ffffff',
    //         },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    //   styles: {
    //     fillColor: '#3366ff',
    //   },
    // });
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
              'Reference: #INV0001' +
              '\nDate: 2022-01-27' +
              '\nInvoice number: 123456',
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
            content: 'Dibayar Pada: ' + getDateFormatted(data.dateIn),
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
