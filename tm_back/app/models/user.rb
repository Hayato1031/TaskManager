require 'jwt'

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  def generate_jwt
    payload = { sub: id, exp: 60.days.from_now.to_i }
    token = JWT.encode(payload, Rails.application.credentials.secret_key_base)
    Rails.logger.info("Generated JWT: #{token}")
    token
  end

  has_many :tasks, dependent: :destroy
end
