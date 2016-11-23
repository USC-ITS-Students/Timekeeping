select h.document_id,h.dates,p.supervisor_names,p.home_department_name,p.home_department_number,p.employee_name,p.employee_id,p.employee_pay_frequency,p.employee_status,p.employee_start_time,p.first_meal_period_waiver,p.second_meal_period_waiver,p.document_status,p.end_period_date_time,l.sick_rate,l.sick_balance,l.vacation_rate,l.vacation_balance,l.winter_recess_rate,l.winter_recess_balance
from tk_timesheet_history_header_t h
  left OUTER JOIN tk_timesheet_history_personal_information_t p on p.id=h.personal_information_id
  left OUTER JOIN tk_timesheet_history_leave_balance_t l on l.id=h.leave_balance_id
INTO OUTFILE 'header.csv'
FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
LINES TERMINATED BY '\n';

select e.document_id,e.week_number,e.row_number,e.grand_total,e.account_name,e.earncode,e.hours0,e.hours1,e.hours2,e.hours3,e.hours4,e.hours5,e.hours6,e.total_hours
from tk_timesheet_history_earncode_summary_t e
  LEFT outer JOIN tk_timesheet_history_header_t h on e.document_id=h.document_id
  left OUTER JOIN tk_timesheet_history_personal_information_t p on p.id=h.personal_information_id
INTO OUTFILE 'earn_summary.csv'
FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
LINES TERMINATED BY '\n';

select s.document_id,s.week_number,s.sanction_type,s.sanction_0,s.sanction_1,s.sanction_2,s.sanction_3,s.sanction_4,s.sanction_5,s.sanction_6
from tk_timesheet_history_sanctions_t s
  LEFT outer JOIN tk_timesheet_history_header_t h on s.document_id=h.document_id
  left OUTER JOIN tk_timesheet_history_personal_information_t p on p.id=h.personal_information_id
INTO OUTFILE 'sanctions.csv'
FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
LINES TERMINATED BY '\n';

select d.document_id,d.day_in_week,d.hours1,d.hours2,r.week_number,r.row,r.account_name,r.earn_code,r.earn_code_description,r.approver_name,pp.employee_id,r.routing_status
from tk_timesheet_history_time_capture_date_t d
  LEFT JOIN tk_timesheet_history_time_capture_row_t r on d.time_capture_row_id=r.id
  LEFT outer JOIN tk_timesheet_history_header_t h on d.document_id=h.document_id
  left OUTER JOIN tk_timesheet_history_personal_information_t p on p.id=h.personal_information_id
  left OUTER JOIN t2wd.tk_principal_properties_t pp ON r.approver_id=pp.principal_id
INTO OUTFILE 'time.csv'
FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
LINES TERMINATED BY '\n';

SELECT t2wd.tk_principal_properties_t.*,first_nm,last_nm from t2wd.tk_principal_properties_t
  LEFT JOIN krwd.krim_entity_nm_t ON principal_id=entity_id
INTO OUTFILE 'principal_properties.csv'
FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
LINES TERMINATED BY '\n';

