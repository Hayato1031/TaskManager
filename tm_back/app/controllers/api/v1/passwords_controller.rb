module Api
    module V1
        class PasswordsController < Devise::PasswordsController
            def create
                self.resource = resource_class.send_reset_password_instructions(resource_params)
                if successfully_sent?(resource)
                    render json: { success: true, message: 'パスワードリセットのメールを送信しました。' }, status: :ok
                else
                    render json: { success: false, error: resource.errors.full_messages }, status: :unprocessable_entity
                end
            end

            def update
                self.resource = resource_class.reset_password_by_token(resource_params)
                if resource.errors.empty?
                  render json: { success: true, message: 'パスワードがリセットされました。' }, status: :ok
                else
                  render json: { success: false, errors: resource.errors.full_messages }, status: :unprocessable_entity
                end
            end

            private
            def resource_params
                params.require(:user).permit(:email, :password, :password_confirmation, :reset_password_token)
            end
        end
    end
end