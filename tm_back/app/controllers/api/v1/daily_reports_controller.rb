module Api
    module V1
        class DailyReportsController < ApplicationController
            def create
                daily_report = DailyReport.new(daily_report_params)
                daily_report.id = SecureRandom.uuid
                if daily_report.save
                    render json: {status: true, message: 'Saved daily report', data: daily_report}, status: :ok
                else
                    render json: {status: false, message: 'Daily report not saved', data: daily_report.errors}, status: :unprocessable_entity
                end
            end

            def show
                daily_report = DailyReport.find_by(id: params[:id])
                task = daily_report.task
                admin = task.user
                comments = daily_report.comments
                if daily_report
                    render json: {status: true, data: daily_report, task: task, admin: admin, comments: comments}, status: :ok
                else
                    render json: {status: false, message: 'Daily report not found'}, status: :not_found
                end
            end

            def update
                daily_report = DailyReport.find_by(id: params[:id])
                if daily_report.update(daily_report_params)
                    render json: {status: true, message: 'Updated daily report', data: daily_report}, status: :ok
                else
                    render json: {status: false, message: 'Daily report not updated', data: daily_report.errors}, status: :unprocessable_entity
                end
            end

            def destroy
                daily_report = DailyReport.find_by(id: params[:id])
                if daily_report.destroy
                    render json: {status: true, message: 'Daily report deleted successfully'}, status: :ok
                else
                    render json: {status: false, message: 'Daily report not deleted', data: daily_report.errors}, status: :unprocessable_entity
                end
            end

            private

            def daily_report_params
                params.require(:daily_report).permit(:date, :summary, :content, :notice, :next_action, :task_id, :approved)
            end
        end
    end
end