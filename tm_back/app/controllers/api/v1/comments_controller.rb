module Api
    module V1
        class CommentsController < ApplicationController
            def create
                daily_report = DailyReport.find(params[:comment][:daily_report])
                comment = Comment.new(comment_params.merge(daily_report: daily_report))

                if comment.save
                    render json: {status: true, message: 'Saved comment', data: comment}, status: :ok
                else
                    render json: {status: false, message: 'Comment not saved', data: comment.errors}, status: :unprocessable_entity
                end
            end

            def destroy
                comment = Comment.find(params[:id])
                comment.destroy
                render json: {status: true, message: 'Deleted comment', data: comment}, status: :ok
            end


            private
            def comment_params
                params.require(:comment).permit(:content, :admin, :daily_report)
            end
        end
    end
end