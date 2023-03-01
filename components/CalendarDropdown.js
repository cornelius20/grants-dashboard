import Calendar from 'react-calendar';
import styles from './CalendarDropDown.module.css';
import DropdownIcon from '../public/images/dropdown.svg';
import { useState, useEffect, useRef } from 'react';

const CalendarDropdown = (props) => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [show, setShow] = useState(false);
	const ref = useRef();
	const reference = useRef(false);

	useEffect(() => {
		setShow(false);
	}, [props.value]);

	useEffect(() => {
		const checkIfClickedOutside = (e) => {
			if (show && ref.current && !ref.current.contains(e.target)) {
				setShow(false);
			}
		};

		document.addEventListener('mousedown', checkIfClickedOutside);
		return () => {
			document.removeEventListener('mousedown', checkIfClickedOutside);
		};
	});

	return (
		<div className={styles.calendarWrapper}>
			<button
				className={styles.calendarDropdownButton}
				onClick={() => {
					setShow(!show);
					reference.current = true;
				}}
			>
				<p>
					{reference.current === true
						? props.value
								.toLocaleString('default', {
									month: 'long',
									day: '2-digit',
									year: '2-digit'
								})
								.replace(' ', '-')
								.replace(',', '-')
								.replace(' ', '')
						: 'Drop down...'}
				</p>
				<DropdownIcon />
			</button>
			<div ref={ref}>
				<Calendar
					className={show ? styles.show : styles.hide}
					onChange={props.onChange}
					value={props.value}
					// maxDate={new Date(currentDate.setMonth(currentDate.getMonth()+3))}
					minDate={new Date()}
					maxDate={new Date(new Date().getFullYear(),new Date().getMonth() + 6,new Date().getDate())}

				/>
			</div>
		</div>
	);
};

export default CalendarDropdown;
