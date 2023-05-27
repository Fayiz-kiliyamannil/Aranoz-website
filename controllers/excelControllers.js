const excelJs = require('exceljs')
const Order =require("../models/modelUserOrder")

const downloadExcel = async (req, res) => {
    try {

        const from = req.query.from
        const to = req.query.to
        let query = { status: 'delivered' };

        if (from && to) {
          query.orderdate = {
            $gte: from,
            $lte: to,
          };
        } else if (from) {
          query.orderdate = {
            $gte: from,
          };
        } else if (to) {
          query.orderdate = {
            $lte: to,
          };
        }
       console.log("query----------",query);
        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report")

        worksheet.columns = [
            { header: "OderID", key: "_id" },
            { header: "Date", key: "orderdate" },
            { header: "Payment Method", key: "paymentmethod" },
            { header: "Total Amount", key: "grandtotal" },
        ]
        const deliveredProducts = await Order.find(query).lean()
        deliveredProducts.forEach((things) => {
            worksheet.addRow(things)
        })

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true }
        });


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
        )
        res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`)
        return workbook.xlsx.write(res).then(() => {
            res.status(200);
        })

    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    downloadExcel,

}