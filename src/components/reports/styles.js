const styles = theme => ({
    container: {
        textAlign: 'center',
    },
    textField: {
        textAlign: 'center',
        fontSize: 25
    },
    freeTextContainerStyle: {
        width: '15%',
        wordBreak: 'break-word'
    },
    freeTextStyle: {
        fontSize: 15
    },
    buttonDivStyle: {
        float: 'right'
    },
    modalStyle: {
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        position: 'absolute',
        // width: theme.spacing.unit * 50,
        width: '80%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        container: {
            display: 'flex',
        },
        overflowY: 'auto',
    },
    headerRow: {
        color: '#2196f3',
        fontSize: 16
    },
    cellRow: {
        fontSize: 15,
    },
    reportPeriodDivStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 15,
    },
    totalMilesDivStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 18,
        margin: 30,
        padding: theme.spacing.unit * 4,
    },
});

export default styles;
