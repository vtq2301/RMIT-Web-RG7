const { MongoClient } = require('mongodb');

async function processOrders() {
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('your_database_name'); // Replace 'your_database_name' with the actual database name

    const collection = db.collection('orders'); // Replace 'orders' with the actual collection name

    let i = 0;
    const orders = await collection.find({ status: 'On Going', hub: req.session.hub }).toArray();
    for (const order of orders) {
      const buyer = order.buyer;
      const number = order.number;
      const email = order.email;
      const add = order.add;
      const price = order.price;
      const hub = order.hub;

      if (req.query['deliver' + buyer]) {
        await collection.updateOne({ _id: order._id }, { $set: { status: 'Deliver' } });
        continue;
      }

      if (req.query['cancel' + buyer]) {
        await collection.updateOne({ _id: order._id }, { $set: { status: 'Cancelled' } });
        continue;
      }

      i++;
      console.log(`
        <tr>
          <td style=''>${i}</td>
          <td style=''>${buyer}</td>
          <td style=''>${number}</td>
          <td style=''>${add}</td>
          <td style=''>$${price}</td>
          <td class='form-group'>
            <a href='?deliver${buyer}=yes' class='btn btn-primary'><i class='glyphicon glyphicon-ok'></i></a>
            <a href='?cancel${buyer}=yes' class='btn btn-danger'><i class='glyphicon glyphicon-remove'></i></a>
          </td>
        </tr>
      `);
    }

    client.close();
  } catch (error) {
    console.error(error);
  }
}

processOrders();