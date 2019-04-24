import React from 'react';

function About()
{
    return (
        <div class="card" style={{ textAlign: 'center' }}>
            <div class="card-body">
                <div class="container-fluid">
                    <div class="text-center"><h1 style={{ color: 'steelblue' }}>&Xi;SC&Lambda;L&Lambda;D&Lambda;&nbsp;&nbsp;&nbsp;</h1></div>
                    <div class="text-center" style={{ fontStyle: 'italic' }}>A climber's log</div>
                    <div class="text-center"><br />Developed on React</div>
                    <div class="text-center">
                        <img src={require('./logo.svg')} alt="React logo" class="img-responsive center-block" style={{ maxHeight: '100px', paddingTop: '10px', paddingBottom: '10px' }} />
                        <div class="text-center">by</div>
                        <div class="text-center"><h3>RΞM</h3></div>
                        <div class="text-center"><a href="http://www.remranger.com">www.remranger.com</a></div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default About;