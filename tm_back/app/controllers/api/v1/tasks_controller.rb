module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate_request!, except: [:show]

      def index
        tasks = current_user.tasks
        render json: { success: true, tasks: tasks }, status: :ok
      end

      def create
        task = current_user.tasks.build(task_params)
        task.id = SecureRandom.uuid
        if task.save
          render json: { success: true, task: task }, status: :ok
        else
          render json: { success: false, error: task.errors.full_messages.join(',') }, status: :unprocessable_entity
        end
      end

      def show
        task = Task.find_by(id: params[:id])
        admin = task.user
        daily_reports = task.daily_reports
        if task
          render json: { success: true, task: task, admin: admin, daily_reports: daily_reports }, status: :ok
        else
          render json: { success: false, error: 'Task not found' }, status: :not_found
        end
      end

      def update
        task = Task.find_by(id: params[:id])
        admin = task.user
        if task.update(update_params)
          render json: { success: true, task: task, admin: admin }, status: :ok
        else
          render json: { success: false, error: task.errors.full_messages.join(',') }, status: :unprocessable_entity
        end
      end

      def destroy
        task = Task.find_by(id: params[:id])
        if task.destroy
          render json: { success: true, message: 'Task deleted successfully' }, status: :ok
        else
          render json: { success: false, error: task.errors.full_messages.join(',') }, status: :unprocessable_entity
        end
      end

      private

      def task_params
        params.require(:task).permit(:title, :member, :goal, :description)
      end

      def update_params
        params.require(:task).permit(:title, :member, :status, :goal, :description)
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