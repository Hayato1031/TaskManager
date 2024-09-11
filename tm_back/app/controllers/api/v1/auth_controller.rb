module Api
  module V1
    class AuthController < ApplicationController
      include ActionController::Cookies

      # ユーザー登録
      def register
        user = User.new(user_params_register)

        if user.save
          token = user.generate_jwt
          set_jwt_cookie(token)
          render json: { success: true, user: user, token: token }, status: :created
        else
          Rails.logger.error("User registration failed: #{user.errors.full_messages.join(', ')}")
          render json: { success: false, error: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # ログイン
      def login
        user = User.find_by(email: params[:email])

        if user&.valid_password?(params[:password]) && user.confirmed?
          token = user.generate_jwt
          set_jwt_cookie(token)
          render json: { success: true, user: user.as_json(only: [:id, :name, :email]), token: token }, status: :ok
        else
          render json: { success: false, error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      # トークン検証
      def validate_token
        token = request.headers['Authorization']&.split(' ')&.last
        
        unless token
          Rails.logger.error("No token provided in the request")
          return render json: { success: false, error: 'No token provided' }, status: :unauthorized
        end
      
        begin
          # トークンをデコードしてユーザーIDを取得
          decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: 'HS256')
          payload = decoded_token[0]
          user_id = payload['sub'] # subにユーザーIDがあることを想定
          
          # 追加のデバッグ: user_idの内容確認
          Rails.logger.info("Decoded JWT payload: #{payload.inspect}")
          Rails.logger.info("Extracted user_id from token: #{user_id.inspect}")
      
          # user_idがnilや空文字でないことを確認
          if user_id.nil? || user_id.to_s.strip.empty?
            Rails.logger.error("Extracted user_id is nil or empty")
            return render json: { success: false, error: 'Invalid token: User ID missing' }, status: :unauthorized
          end
      
          @current_user = User.find_by(id: user_id)
      
        rescue JWT::DecodeError => e
          Rails.logger.error("JWT Decode Error: #{e.message}")
          return render json: { success: false, error: 'Invalid token' }, status: :unauthorized
        end
      
        unless @current_user
          Rails.logger.error("User not found with ID: #{user_id}")
          return render json: { success: false, error: 'User not found' }, status: :unauthorized
        end
      
        render json: { success: true, user: @current_user }, status: :ok
      end

      private

      def user_params_register
        params.require(:auth).permit(:email, :name, :password, :password_confirmation)
      end

      def set_jwt_cookie(token)
        cookies.signed[:jwt] = { 
          value: token, 
          httponly: true, 
          secure: Rails.env.production?, 
          same_site: :lax 
        }
      end

      # 現在のユーザーを設定するメソッド
      def authenticate_user
        token = cookies.signed[:jwt]
        decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: 'HS256') rescue nil

        if decoded_token
          user_id = decoded_token[0]['sub']
          @current_user = User.find_by(id: user_id)
        end

        unless @current_user
          render json: { success: false, error: 'Invalid token' }, status: :unauthorized
        end
      end

      def current_user
        @current_user
      end
    end
  end
end