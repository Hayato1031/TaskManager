class Api::V1::ConfirmationsController < Devise::ConfirmationsController

  def create
    # emailパラメータのみを使用する
    email = params[:email]
    if email.present?
      user = User.find_by(email: email)
      if user
        if user.confirmed?
          render json: { success: false, error: 'User is already confirmed.' }, status: :unprocessable_entity
        else
          user.send_confirmation_instructions
          render json: { success: true, message: 'Confirmation email resent.' }, status: :ok
        end
      else
        render json: { success: false, error: 'User not found.' }, status: :unprocessable_entity
      end
    else
      render json: { success: false, error: 'Email parameter is missing.' }, status: :unprocessable_entity
    end
  end

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    if resource.errors.empty?
      render json: { status: 'success', message: 'Account confirmed successfully.' }, status: :ok
    else
      # エラーメッセージの詳細を確認
      Rails.logger.error(resource.errors.full_messages)
      render json: { status: 'error', errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
