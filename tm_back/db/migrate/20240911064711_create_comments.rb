class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.text :content
      t.boolean :admin, default: false
      t.references :daily_report, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end
