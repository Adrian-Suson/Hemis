import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
} from "@mui/material";
import { People, Assessment, EventNote, Add } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";

function DashboardPage() {
    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                📊 Information System Dashboard
            </Typography>

            {/* Top Statistics Cards */}
            <Grid container spacing={3}>
                {/* Users */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <People fontSize="large" color="primary" />
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h4" fontWeight="bold">
                                1,250
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Reports */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Assessment fontSize="large" color="secondary" />
                            <Typography variant="h6">
                                Reports Generated
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                342
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Events */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <EventNote fontSize="large" color="success" />
                            <Typography variant="h6">
                                Upcoming Events
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                5
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Actions */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Add fontSize="large" color="error" />
                            <Typography variant="h6">
                                Pending Actions
                            </Typography>
                            <Typography variant="h4" fontWeight="bold">
                                12
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts and Recent Activities */}
            <Grid container spacing={3} mt={3}>
                {/* System Performance Chart */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                📈 System Performance
                            </Typography>
                            <LineChart
                                xAxis={[
                                    {
                                        scaleType: "point",
                                        data: [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                        ],
                                    },
                                ]}
                                series={[
                                    {
                                        data: [30, 50, 40, 70, 60, 90],
                                        label: "Users",
                                    },
                                    {
                                        data: [20, 40, 30, 60, 50, 80],
                                        label: "Reports",
                                    },
                                ]}
                                width={600}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                📅 Recent Activities
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body1">
                                ✔ User John added a new report.
                            </Typography>
                            <Typography variant="body1">
                                ✔ System updated to v2.1
                            </Typography>
                            <Typography variant="body1">
                                ✔ Admin approved 5 new users.
                            </Typography>
                            <Typography variant="body1">
                                ✔ Scheduled maintenance on March 10.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Grid container spacing={3} mt={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">
                                ⚡ Quick Actions
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Add />}
                                    >
                                        Add User
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<Assessment />}
                                    >
                                        Generate Report
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<EventNote />}
                                    >
                                        View Events
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashboardPage;
