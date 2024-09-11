class CreateDailyReports < ActiveRecord::Migration[7.1]
  def change
    create_table :daily_reports, id: :uuid do |t|
      t.date :date, null: false
      t.string :summary, null: false
      t.text :content, null: false
      t.text :notice
      t.text :next_action
      t.boolean :approved, default: false
      t.references :task, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end
