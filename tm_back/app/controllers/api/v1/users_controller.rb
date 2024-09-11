module Api
    module V1
      class UsersController < ApplicationController
        before_action :authenticate_request!
  
        # ユーザー名の更新
        def update_username
          if current_user.update(username_params)
            render json: { success: true, message: 'ユーザー名が更新されました' }, status: :ok
          else
            render json: { success: false, error: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # メールアドレスの更新
        def update_email
            if current_user.valid_password?(email_params[:current_password])
                if current_user.update(email: email_params[:email])
                    current_user.send_confirmation_instructions # 確認メールを送信
                    render json: { success: true, message: '確認メールが新しいメールアドレスに送信されました。確認を完了してください。' }, status: :ok
                else
                    render json: { success: false, error: current_user.errors.full_messages }, status: :unprocessable_entity
                end
            else
                render json: { success: false, error: '現在のパスワードが正しくありません' }, status: :unauthorized
            end
        end
        
        def update_password
            if current_user.update_with_password(password_params)
                render json: { success: true, message: 'パスワードが更新されました' }, status: :ok
            else
                render json: { success: false, error: current_user.errors.full_messages }, status: :unprocessable_entity
            end
        end

        def destroy
            if current_user.destroy
                render json: { success: true, message: 'アカウントが削除されました' }, status: :ok
            else
                render json: { success: false, error: current_user.errors.full_messages }, status: :unprocessable_entity
            end
        end

        private
  
        def username_params
          params.require(:user).permit(:name)
        end

        def email_params
            params.require(:user).permit(:email, :current_password)
        end

        def password_params
            params.require(:user).permit(:current_password, :password, :password_confirmation)
        end
  
        def authenticate_request!
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
  
          Rails.logger.info("Authenticated user: #{@current_user.inspect}")
        end
  
        def current_user
          @current_user
        end
      end
    end
  end