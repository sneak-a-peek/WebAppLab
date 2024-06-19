from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import cross_origin


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://stepan:qwerty@localhost/lab'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)


class Ad(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(),
                           onupdate=db.func.current_timestamp())


class AdSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'description', 'created_at', 'updated_at')


ad_schema = AdSchema()
ads_schema = AdSchema(many=True)


@app.route('/ads', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def get_ads():
    all_ads = Ad.query.all()
    return ads_schema.jsonify(all_ads)


@app.route('/ads/<int:id>', methods=['GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def get_ad(id):
    ad = Ad.query.get(id)
    if ad is None:
        return jsonify({'message': 'Ad not found'}, 404)
    return ad_schema.jsonify(ad)


@app.route('/ads', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def create_ad():
    data = request.get_json()
    new_ad = Ad(title=data['title'], description=data['description'])
    db.session.add(new_ad)
    db.session.commit()
    return ad_schema.jsonify(new_ad)


@app.route('/ads/<int:id>', methods=['PUT'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def update_ad(id):
    ad = Ad.query.get(id)
    if ad is None:
        return jsonify({'message': 'Ad not found'}, 404)
    data = request.get_json()
    ad.title = data.get('title', ad.title)
    ad.description = data.get('description', ad.description)
    db.session.commit()
    return ad_schema.jsonify(ad)


@app.route('/ads/<int:id>', methods=['DELETE'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def delete_ad(id):
    ad = Ad.query.get(id)
    if ad is None:
        return jsonify({'message': 'Ad not found'}, 404)
    db.session.delete(ad)
    db.session.commit()
    return jsonify({'message': 'Ad deleted'})


if __name__ == '__main__':
    app.run(debug=True)
